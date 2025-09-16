// Global variables
let musselsData = [];
let filteredData = [];
let currentMussel = null;
let currentImageIndex = 0;

// DOM elements
const elements = {
    loadingState: document.getElementById('loadingState'),
    musselGrid: document.getElementById('musselGrid'),
    noResults: document.getElementById('noResults'),
    searchInput: document.getElementById('searchInput'),
    clearSearch: document.getElementById('clearSearch'),
    basinFilter: document.getElementById('basinFilter'),
    hostCountFilter: document.getElementById('hostCountFilter'),
    resetFilters: document.getElementById('resetFilters'),
    musselCount: document.getElementById('musselCount'),
    imageCount: document.getElementById('imageCount'),
    modal: document.getElementById('musselModal'),
    closeModal: document.getElementById('closeModal'),
    modalBackdrop: document.querySelector('.modal-backdrop'),
    modalTitle: document.getElementById('modalTitle'),
    imageCarousel: document.getElementById('imageCarousel'),
    prevImage: document.getElementById('prevImage'),
    nextImage: document.getElementById('nextImage'),
    imageCounter: document.getElementById('imageCounter'),
    tabBtns: document.querySelectorAll('.tab-btn'),
    tabPanels: document.querySelectorAll('.tab-panel')
};

// Initialize the application
async function init() {
    try {
        // Load mussel data
        const response = await fetch('mussels_clean.json');
        musselsData = await response.json();
        filteredData = [...musselsData];
        
        // Populate filter options
        populateBasinFilter();
        
        // Render initial grid
        renderMusselGrid();
        updateStats();
        
        // Hide loading state
        elements.loadingState.style.display = 'none';
        
        // Set up event listeners
        setupEventListeners();
        
    } catch (error) {
        console.error('Error loading mussel data:', error);
        elements.loadingState.innerHTML = `
            <div class="loading-spinner"></div>
            <p>Error loading data. Please refresh the page.</p>
        `;
    }
}

// Populate basin filter dropdown
function populateBasinFilter() {
    const basins = [...new Set(musselsData
        .map(mussel => mussel.basin)
        .filter(basin => basin && basin.trim())
    )].sort();
    
    basins.forEach(basin => {
        const option = document.createElement('option');
        option.value = basin;
        option.textContent = basin;
        elements.basinFilter.appendChild(option);
    });
}

// Set up all event listeners
function setupEventListeners() {
    // Search functionality
    elements.searchInput.addEventListener('input', debounce(handleSearch, 300));
    elements.clearSearch.addEventListener('click', clearSearch);
    
    // Filter functionality
    elements.basinFilter.addEventListener('change', handleFilter);
    elements.hostCountFilter.addEventListener('change', handleFilter);
    elements.resetFilters.addEventListener('click', resetFilters);
    
    // Modal functionality
    elements.closeModal.addEventListener('click', closeModal);
    elements.modalBackdrop.addEventListener('click', closeModal);
    
    // Image carousel
    elements.prevImage.addEventListener('click', () => changeImage(-1));
    elements.nextImage.addEventListener('click', () => changeImage(1));
    
    // Tab functionality
    elements.tabBtns.forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboard);
}

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Handle search input
function handleSearch() {
    const query = elements.searchInput.value.toLowerCase().trim();
    
    if (query === '') {
        filteredData = [...musselsData];
    } else {
        filteredData = musselsData.filter(mussel => {
            const searchText = [
                mussel.common_name,
                mussel.species,
                mussel.basin,
                mussel.defining_characteristics,
                mussel.shell_description,
                mussel.nacre,
                mussel.periostracum,
                mussel.other_characteristics
            ].join(' ').toLowerCase();
            
            return searchText.includes(query);
        });
    }
    
    applyFilters();
}

// Clear search
function clearSearch() {
    elements.searchInput.value = '';
    elements.clearSearch.style.display = 'none';
    handleSearch();
}

// Handle filter changes
function handleFilter() {
    applyFilters();
}

// Apply all filters
function applyFilters() {
    let filtered = [...filteredData];
    
    // Basin filter
    const basinFilter = elements.basinFilter.value;
    if (basinFilter) {
        filtered = filtered.filter(mussel => mussel.basin === basinFilter);
    }
    
    // Host count filter
    const hostCountFilter = elements.hostCountFilter.value;
    if (hostCountFilter) {
        filtered = filtered.filter(mussel => {
            const count = mussel.host_fish_count;
            switch (hostCountFilter) {
                case '1-5': return count >= 1 && count <= 5;
                case '6-15': return count >= 6 && count <= 15;
                case '16-25': return count >= 16 && count <= 25;
                case '26+': return count >= 26;
                default: return true;
            }
        });
    }
    
    renderMusselGrid(filtered);
    updateStats(filtered);
}

// Reset all filters
function resetFilters() {
    elements.searchInput.value = '';
    elements.basinFilter.value = '';
    elements.hostCountFilter.value = '';
    elements.clearSearch.style.display = 'none';
    filteredData = [...musselsData];
    applyFilters();
}

// Render mussel grid
function renderMusselGrid(data = filteredData) {
    if (data.length === 0) {
        elements.musselGrid.style.display = 'none';
        elements.noResults.style.display = 'block';
        return;
    }
    
    elements.musselGrid.style.display = 'grid';
    elements.noResults.style.display = 'none';
    
    elements.musselGrid.innerHTML = data.map(mussel => createMusselCard(mussel)).join('');
    
    // Add click listeners to cards
    document.querySelectorAll('.mussel-card').forEach(card => {
        card.addEventListener('click', () => openModal(card.dataset.musselId));
    });
}

// Create mussel card HTML
function createMusselCard(mussel) {
    const imageCount = mussel.images ? mussel.images.length : 0;
    const firstImage = mussel.images && mussel.images.length > 0 ? mussel.images[0] : null;
    
    return `
        <div class="mussel-card" data-mussel-id="${mussel.id}">
            ${imageCount > 0 ? `<div class="image-count">${imageCount} image${imageCount > 1 ? 's' : ''}</div>` : ''}
            <div class="mussel-card-image">
                ${firstImage ? 
                    `<img src="images/${firstImage}" alt="${mussel.common_name}" style="width: 100%; height: 100%; object-fit: cover;">` :
                    `<i class="fas fa-seedling"></i>`
                }
            </div>
            <div class="mussel-card-content">
                <h3 class="mussel-card-title">${mussel.common_name}</h3>
                <p class="mussel-card-species">${mussel.species || 'Species not specified'}</p>
                <div class="mussel-card-stats">
                    <div class="stat-item">
                        <div class="stat-value">${mussel.host_fish_count || 0}</div>
                        <div class="stat-label">Host Fish</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${imageCount}</div>
                        <div class="stat-label">Images</div>
                    </div>
                </div>
                <div class="mussel-card-basin">${mussel.basin || 'Basin not specified'}</div>
            </div>
        </div>
    `;
}

// Update statistics
function updateStats(data = filteredData) {
    const totalImages = data.reduce((sum, mussel) => sum + (mussel.images ? mussel.images.length : 0), 0);
    elements.musselCount.textContent = `${data.length} mussel${data.length !== 1 ? 's' : ''}`;
    elements.imageCount.textContent = `${totalImages} image${totalImages !== 1 ? 's' : ''}`;
}

// Open modal
function openModal(musselId) {
    currentMussel = musselsData.find(m => m.id === parseInt(musselId));
    if (!currentMussel) return;
    
    currentImageIndex = 0;
    populateModal();
    elements.modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
    elements.modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    currentMussel = null;
    currentImageIndex = 0;
}

// Populate modal content
function populateModal() {
    // Title
    elements.modalTitle.textContent = currentMussel.common_name;
    
    // Images
    populateImageCarousel();
    
    // Overview tab
    populateOverviewTab();
    
    // Characteristics tab
    populateCharacteristicsTab();
    
    // Hosts tab
    populateHostsTab();
    
    // Identification tab
    populateIdentificationTab();
    
    // Switch to overview tab
    switchTab('overview');
}

// Populate image carousel
function populateImageCarousel() {
    const images = currentMussel.images || [];
    
    if (images.length === 0) {
        elements.imageCarousel.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #a0aec0; font-size: 3rem;">
                <i class="fas fa-image"></i>
            </div>
        `;
        elements.prevImage.disabled = true;
        elements.nextImage.disabled = true;
        elements.imageCounter.textContent = '0 / 0';
        return;
    }
    
    elements.imageCarousel.innerHTML = images.map((image, index) => `
        <img src="images/${image}" alt="${currentMussel.common_name} ${index + 1}" 
             class="carousel-image ${index === 0 ? 'active' : ''}">
    `).join('');
    
    elements.prevImage.disabled = images.length <= 1;
    elements.nextImage.disabled = images.length <= 1;
    elements.imageCounter.textContent = `1 / ${images.length}`;
}

// Change image in carousel
function changeImage(direction) {
    const images = currentMussel.images || [];
    if (images.length <= 1) return;
    
    const totalImages = images.length;
    currentImageIndex = (currentImageIndex + direction + totalImages) % totalImages;
    
    // Update active image
    document.querySelectorAll('.carousel-image').forEach((img, index) => {
        img.classList.toggle('active', index === currentImageIndex);
    });
    
    // Update counter
    elements.imageCounter.textContent = `${currentImageIndex + 1} / ${totalImages}`;
    
    // Update button states
    elements.prevImage.disabled = false;
    elements.nextImage.disabled = false;
}

// Populate overview tab
function populateOverviewTab() {
    document.getElementById('modalSpecies').textContent = currentMussel.species || 'Not specified';
    document.getElementById('modalBasin').textContent = currentMussel.basin || 'Not specified';
    document.getElementById('modalHostCount').textContent = currentMussel.host_fish_count || 0;
    document.getElementById('modalCommonHost').textContent = currentMussel.most_common_host || 'Not specified';
    document.getElementById('modalDescription').textContent = currentMussel.defining_characteristics || 'No description available';
}

// Populate characteristics tab
function populateCharacteristicsTab() {
    document.getElementById('shellDescription').textContent = currentMussel.shell_description || 'No shell description available';
    document.getElementById('nacreDescription').textContent = currentMussel.nacre || 'No nacre description available';
    document.getElementById('periostracumDescription').textContent = currentMussel.periostracum || 'No periostracum description available';
    document.getElementById('otherCharacteristics').textContent = currentMussel.other_characteristics || 'No other characteristics available';
}

// Populate hosts tab
function populateHostsTab() {
    const hostCount = currentMussel.host_fish_count || 0;
    document.getElementById('hostCountSummary').textContent = hostCount;
    
    const hosts = currentMussel.reported_hosts || '';
    const hostList = hosts.split(',').map(host => host.trim()).filter(host => host);
    
    const hostTags = hostList.map(host => `<span class="host-tag">${host}</span>`).join('');
    document.getElementById('hostList').innerHTML = hostTags || '<p>No host fish information available</p>';
}

// Populate identification tab
function populateIdentificationTab() {
    document.getElementById('confusionText').textContent = currentMussel.maybe_confused || 'No confusion information available';
    document.getElementById('imageCredit').textContent = currentMussel.image_credit || 'No image credit information available';
}

// Switch tabs
function switchTab(tabName) {
    // Update tab buttons
    elements.tabBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });
    
    // Update tab panels
    elements.tabPanels.forEach(panel => {
        panel.classList.toggle('active', panel.id === tabName);
    });
}

// Handle keyboard navigation
function handleKeyboard(event) {
    if (elements.modal.style.display === 'none') return;
    
    switch (event.key) {
        case 'Escape':
            closeModal();
            break;
        case 'ArrowLeft':
            changeImage(-1);
            break;
        case 'ArrowRight':
            changeImage(1);
            break;
    }
}

// Show/hide clear search button
elements.searchInput.addEventListener('input', function() {
    elements.clearSearch.style.display = this.value.trim() ? 'block' : 'none';
});

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
