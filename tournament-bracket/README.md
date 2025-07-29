# Image Tournament Bracket

A React TypeScript application that allows users to create and conduct tournament brackets using images as competitors. Perfect for fun competitions like "best pet photo," "favorite vacation spot," or any visual comparison tournament.

## Features

### 🖼️ Image Management
- **Upload 64 Images**: Drag-and-drop or click to upload exactly 64 images
- **Visual Progress**: Real-time progress bar showing upload status
- **Image Preview**: Grid view of all uploaded images with removal option
- **File Validation**: Automatic filtering for image file types

### 🎯 Team Assignment
- **Random Assignment**: Automatically shuffle teams into random bracket positions
- **Manual Assignment**: Drag-and-drop interface to manually arrange team seeding
- **Visual Feedback**: See seed numbers and team positioning before starting

### 🏆 Tournament Gameplay
- **Head-to-Head Voting**: Side-by-side image comparison for easy decision making
- **Progress Tracking**: Visual progress bar and match counters
- **Round Names**: Automatic naming (Round of 64, Quarter Finals, Semi Finals, Final)
- **Responsive Design**: Works great on desktop and mobile devices

### 📊 Bracket Visualization
- **Live Bracket**: Real-time tournament bracket showing all rounds and results
- **Winner Highlighting**: Clear visual indication of winning teams in each match
- **Tournament Statistics**: Track completed matches, total teams, and rounds
- **Horizontal Scrolling**: Navigate through all tournament rounds easily

### 🎉 Results & Completion
- **Championship Display**: Celebrate the tournament winner with a special view
- **Final Bracket**: View the complete tournament results
- **Reset Functionality**: Start a new tournament anytime

## Technology Stack

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React DnD** for drag-and-drop functionality
- **Lucide React** for icons
- **UUID** for unique identifiers

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tournament-bracket
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## How to Use

### Step 1: Upload Images
1. Visit the application in your browser
2. Drag and drop 64 images or click "Browse Files"
3. Remove any unwanted images by hovering and clicking the X
4. Once you have exactly 64 images, click "Proceed to Team Assignment"

### Step 2: Choose Assignment Method
- **Random Assignment**: Teams will be randomly shuffled when the tournament starts
- **Manual Assignment**: Drag and drop images to arrange them in your preferred seeding order

### Step 3: Conduct the Tournament
1. View each head-to-head matchup
2. Click on the image you want to advance to the next round
3. Continue through all rounds until a champion is crowned
4. Use "View Bracket" to see the tournament structure at any time

### Step 4: View Results
- See the final champion highlighted
- View the complete bracket with all results
- Start a new tournament with different images

## Project Structure

```
src/
├── components/           # React components
│   ├── ImageUpload.tsx      # Image upload and management
│   ├── TeamAssignment.tsx   # Team seeding and assignment
│   ├── MatchVoting.tsx      # Head-to-head voting interface
│   └── BracketDisplay.tsx   # Tournament bracket visualization
├── types/               # TypeScript type definitions
│   └── tournament.ts        # Tournament-related interfaces
├── utils/               # Utility functions
│   └── tournamentUtils.ts   # Tournament logic and bracket generation
├── App.tsx             # Main application component
├── index.tsx           # Application entry point
└── index.css           # Global styles with Tailwind CSS
```

## Key Features Explained

### Tournament Logic
- **64-Team Single Elimination**: Classic tournament format with 6 rounds
- **Automatic Bracket Generation**: Creates proper tournament structure
- **Match Progression**: Winners automatically advance to next round
- **State Management**: Maintains tournament state throughout the competition

### User Experience
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Visual Feedback**: Hover effects, progress indicators, and status updates
- **Intuitive Navigation**: Clear buttons and navigation between phases
- **Error Handling**: Graceful handling of edge cases and user errors

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Future Enhancements

- **Multiple Tournament Sizes**: Support for 32, 16, or 8-team tournaments
- **Save/Load Tournaments**: Ability to save tournament progress
- **Tournament History**: View past tournament results
- **Custom Naming**: Allow custom names for teams/images
- **Animation Effects**: Smooth transitions and celebratory animations
- **Social Sharing**: Share tournament results on social media

## Troubleshooting

### Images Not Loading
- Ensure images are in supported formats (JPG, PNG, GIF)
- Check that image files are not corrupted
- Try refreshing the page if upload seems stuck

### Drag and Drop Not Working
- Make sure you're using a modern browser
- Try using the "Browse Files" button instead
- Check that JavaScript is enabled

### Tournament Not Progressing
- Ensure you've clicked on an image to select a winner
- Check browser console for any error messages
- Try refreshing and restarting the tournament

## Support

If you encounter any issues or have questions, please:
1. Check the troubleshooting section above
2. Search existing issues in the repository
3. Create a new issue with detailed information about the problem

---

**Enjoy your tournament! 🏆**
