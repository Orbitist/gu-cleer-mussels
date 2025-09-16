# Great Lakes Mussels Explorer

A beautiful, interactive web application for exploring freshwater mussel species found in the Great Lakes region. This project showcases 22 different mussel species with detailed information, high-quality images, and an intuitive user interface.

## Features

### 🔍 **Search & Filter**
- **Real-time search** across mussel names, species, characteristics, and descriptions
- **Basin filtering** to explore mussels by specific water bodies
- **Host fish count filtering** to find mussels with different host fish ranges
- **Quick reset** functionality to clear all filters

### 🖼️ **Image Gallery**
- **High-quality images** for each mussel species (50+ total images)
- **Image carousel** with navigation controls in the modal
- **Multiple images per species** showing different angles and details
- **Responsive image display** that works on all devices

### 📊 **Detailed Information**
- **Comprehensive data** including scientific names, basins, host fish counts
- **Tabbed interface** organizing information into:
  - **Overview**: Basic information and key characteristics
  - **Characteristics**: Detailed shell, nacre, and physical descriptions
  - **Host Fish**: Complete list of fish species that serve as hosts
  - **Identification**: Confusion species and identification tips

### 🎨 **Modern Design**
- **Beautiful gradient background** inspired by water themes
- **Card-based layout** with hover effects and smooth animations
- **Responsive design** that works on desktop, tablet, and mobile
- **Accessible interface** with keyboard navigation support

### ⌨️ **Interactive Features**
- **Keyboard shortcuts**: 
  - `Escape` to close modal
  - `Arrow keys` to navigate images
- **Smooth animations** and transitions throughout
- **Loading states** and error handling
- **Statistics display** showing total mussels and images

## Data Source

The application uses data from a comprehensive Excel database containing:
- 22 mussel species from the Great Lakes region
- Detailed morphological characteristics
- Host fish relationships and counts
- Basin information (Lake Erie, Conneaut Creek, etc.)
- High-quality specimen images

## Technical Details

### Files Structure
```
├── index.html          # Main HTML structure
├── styles.css          # Complete CSS styling
├── script.js           # JavaScript functionality
├── mussels_clean.json  # Processed mussel data
├── images/             # Mussel specimen images
└── README.md           # This documentation
```

### Technologies Used
- **HTML5** for semantic structure
- **CSS3** with modern features (Grid, Flexbox, Custom Properties)
- **Vanilla JavaScript** (ES6+) for functionality
- **Font Awesome** for icons
- **Google Fonts** (Inter) for typography

### Browser Support
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Getting Started

1. **Clone or download** the project files
2. **Open `index.html`** in a modern web browser
3. **Explore** the mussel collection using search and filters
4. **Click on any mussel card** to view detailed information and images

## Features in Detail

### Search Functionality
The search feature is incredibly powerful, allowing users to find mussels by:
- Common names (e.g., "Elktoe", "Threeridge")
- Scientific names (e.g., "Alasmidonta marginata")
- Characteristics (e.g., "orange foot", "white nacre")
- Basin names (e.g., "Lake Erie", "Conneaut Creek")

### Image Carousel
Each mussel species can have multiple images showing:
- External shell views
- Internal shell details
- Different angles and perspectives
- Male/female variations (where applicable)

### Data Organization
The information is carefully organized into logical sections:
- **Overview**: Quick facts and key identifying features
- **Characteristics**: Detailed morphological descriptions
- **Host Fish**: Complete ecological relationships
- **Identification**: Tips for distinguishing similar species

## Customization

The application is designed to be easily customizable:
- **Colors**: Modify CSS custom properties for different themes
- **Layout**: Adjust grid columns and spacing in CSS
- **Data**: Add new mussel species by updating the JSON file
- **Images**: Add new images to the images folder and update the JSON

## Future Enhancements

Potential improvements could include:
- **Map integration** showing mussel distribution
- **Comparison tool** for side-by-side species comparison
- **Print-friendly** detailed reports
- **Data export** functionality
- **Advanced filtering** by multiple criteria simultaneously

## Credits

- **Data Source**: Great Lakes mussel research database
- **Images**: Illinois State Museum and Carnegie Museum of Natural History
- **Design**: Modern web design principles with accessibility focus
- **Development**: Clean, maintainable code following best practices

---

*This application was created to make freshwater mussel research more accessible and engaging for researchers, students, and nature enthusiasts.*
