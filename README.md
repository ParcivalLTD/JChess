 # J-Chess

This platform allows players to compete against each other in various game modes, with a focus on unusual starting positions. Players can earn trophies for winning matches, while trophies are deducted for losses. Additionally, players can communicate globally or within matches via a chat function.

The game board offers customization options in the settings. Players can also practice against a chess engine. Our platform is accessible both as a website and as a progressive web app, catering to chess players of all ages interested in unique chess experiences.

## Technologies Used

- **Frontend Development**: HTML, CSS, JavaScript
- **Libraries**: jQuery, Bootstrap, Fontawesome, ChessboardJS, Chess.js
- **Backend Development**: JavaScript (NodeJS), PHP
- **Database**: MySQL
- **Backend Framework**: Express.js
- **Mobile Development**: Cordova

## Getting Started

To run the backend, navigate to the `backend/` directory and execute:

```bash
npm run start
```
or
```bash
node backend/index.js
```

The frontend can either be built using Cordova:

```bash
cordova build
```

Or you can download pre-built versions from the releases.

## Project Structure

```
.
├── .gitattributes
├── .gitignore
├── backend/
│   └── index.js
├── config.xml
├── LICENSE
├── package.json
├── platforms/
│   └── android/
├── README.md
└── www/
    ├── index.html
    ├── bot/
    │   └── index.html
    ├── css/
    │   └── style.css
    ├── img/
    │   └── chesspieces/
    ├── index.html
    ├── js/
    ├── online/
    │   └── index.html
    └── php/
```

## Screenshots

![image](https://github.com/ParcivalLTD/JChess/assets/79400664/2d45a45a-8c1b-40ba-ad60-e5b90dd060a1)
![image](https://github.com/ParcivalLTD/JChess/assets/79400664/5f63cf58-576c-4dbe-9877-4e8e22a1ae49)
![image](https://github.com/ParcivalLTD/JChess/assets/79400664/414e9b3f-a068-42bb-8186-4219fb2ef942)
![image](https://github.com/ParcivalLTD/JChess/assets/79400664/92308063-a458-49d3-b0e2-9e72f490153a)
![image](https://github.com/ParcivalLTD/JChess/assets/79400664/d5837bb9-de1a-423a-bf1b-aa729a2b0126)
![image](https://github.com/ParcivalLTD/JChess/assets/79400664/65d687ea-6b3c-4f20-a22c-83446f1c6938)
![image](https://github.com/ParcivalLTD/JChess/assets/79400664/e7b3ca79-7c6b-40a0-81ce-bb7186659b97)
![image](https://github.com/ParcivalLTD/JChess/assets/79400664/418534e5-16d9-4b2d-9d9f-a2fdd90ceb42)
![image](https://github.com/ParcivalLTD/JChess/assets/79400664/c071027d-fb2b-46c2-a0e6-0669d1fc887b)

## Contributing

We welcome contributions from the community. Feel free to submit pull requests or open issues if you encounter any bugs or have suggestions for improvements.

## License

This project is licensed under the [MIT License](LICENSE).
