// --- Start Menu Logic ---
function toggleStartMenu() {
    const startMenu = document.getElementById("startMenu");
    startMenu.style.display = startMenu.style.display === "none" ? "block" : "none";
}

// Open an app window by its ID
function openApp(appId) {
    const appWindow = document.getElementById(appId);
    appWindow.style.display = "flex";
    toggleStartMenu();

    // Load specific content based on the app being opened
    if (appId === 'textFileWindow') {
        openTextFile(); // Load content into text file window
    } else if (appId === 'notepadWindow') {
        const savedNote = localStorage.getItem('fileContent');
        document.getElementById('notepadTextArea').value = savedNote || '';
    } else if (appId === 'fileExplorerWindow') {
        openFileExplorer(); // Populate file explorer with files
    } else if (appId === 'ticTacToeWindow') {
        startTicTacToe(); // Start the Tic-Tac-Toe game when the window opens
    }
}

// Close an app window by its ID
function closeApp(appId) {
    const appWindow = document.getElementById(appId);
    appWindow.style.display = "none";
}

// Close Start Menu if clicked outside
function closeStartMenu() {
    const startMenu = document.getElementById('startMenu');
    startMenu.style.display = 'none';
}

// --- Notepad Logic ---
function saveNote() {
    const noteContent = document.getElementById('notepadTextArea').value;
    const fileName = "MyTextFile.txt"; // You can dynamically set the file name
    const notes = JSON.parse(localStorage.getItem('notes')) || {};  // Get existing notes or create a new object

    notes[fileName] = noteContent;  // Save or update note content
    localStorage.setItem('notes', JSON.stringify(notes));  // Save the entire notes object
    alert('Note saved as ' + fileName + '!');

    // Optionally, reset or display saved content in the notepad
    document.getElementById('notepadTextArea').value = noteContent;  // Display saved note back
}

// Open the text file and load its content
function openTextFile() {
    const notes = JSON.parse(localStorage.getItem('notes')) || {}; // Load all notes
    const fileContent = notes["MyTextFile.txt"] || "This file is empty.";  // Handle empty case
    const fileDisplay = document.getElementById('fileContentDisplay');
    
    fileDisplay.textContent = fileContent; // Display file content
}

// Open the File Explorer and display files
function openFileExplorer() {
    const fileExplorerList = document.getElementById('fileExplorerList');
    const fileName = "MyTextFile.txt"; // Static file name (you can add more files here)

    // Clear any previous file list
    fileExplorerList.innerHTML = '';

    // Create file entry for MyTextFile.txt
    const fileItem = document.createElement('li');
    fileItem.textContent = fileName;
    fileItem.onclick = function() {
        openApp('textFileWindow');  // Open the file in text file window when clicked
    };

    // Add file to the explorer list
    fileExplorerList.appendChild(fileItem);
}

// --- Tic-Tac-Toe Game Logic ---
let currentPlayer = 'X'; // 'X' starts the game
let gameBoard = ['', '', '', '', '', '', '', '', '']; // 3x3 game grid
let gameOver = false;
let userCanMove = true; // Track if the user can make a move
let aiMoveInProgress = false; // Flag to track if AI is making a move

// Start the Tic-Tac-Toe game
function startTicTacToe() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameOver = false;
    userCanMove = true; // Reset user ability to make a move
    aiMoveInProgress = false;
    renderGameBoard();
    document.getElementById('restartButton').style.display = 'none'; // Hide restart button initially
}

// Render the Tic-Tac-Toe grid
function renderGameBoard() {
    const gameBoardContainer = document.getElementById('ticTacToeGameBoard');
    const cells = gameBoardContainer.getElementsByClassName('cell');

    Array.from(cells).forEach((cell, index) => {
        cell.textContent = gameBoard[index]; // Display the current player's move ('X' or 'O')
        // Add event listener only if the cell is empty and the game is still ongoing
        cell.onclick = (gameBoard[index] === '' && !gameOver) ? () => handleCellClick(index) : null;
    });
}

// Handle a player's click on a cell
function handleCellClick(index) {
    if (gameBoard[index] !== '' || gameOver || !userCanMove) return; // If the cell is already taken or game is over, do nothing

    gameBoard[index] = currentPlayer;
    renderGameBoard();

    if (checkWinner()) {
        alert(`${currentPlayer} wins!`);
        gameOver = true;
        document.getElementById('restartButton').style.display = 'block'; // Show restart button
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X'; // Switch player

    // After the user moves, block them from moving and make the AI move after a short delay
    userCanMove = false;
    setTimeout(() => {
        aiMove();
    }, 500); // Delay AI's move slightly for better gameplay feel
}

// Check for a winner
function checkWinner() {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    return winningCombinations.some(combination => {
        const [a, b, c] = combination;
        return gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c];
    });
}

// Reset the Tic-Tac-Toe game
function resetGame() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameOver = false;
    userCanMove = true; // Enable the user to start again
    renderGameBoard();
    document.getElementById('restartButton').style.display = 'none'; // Hide restart button
}

// AI Move Logic (Minimax algorithm)
function aiMove() {
    if (gameOver) return; // If the game is over, don't let the AI make a move

    const bestMove = minimax(gameBoard, 'O'); // AI makes a move
    gameBoard[bestMove.index] = 'O'; // Place O for AI
    renderGameBoard();

    if (checkWinner()) {
        alert("AI wins!");
        gameOver = true;
        document.getElementById('restartButton').style.display = 'block'; // Show restart button
        return;
    }

    currentPlayer = 'X'; // Switch to player's turn
    userCanMove = true; // Allow the user to make their move again
}

// Minimax Algorithm
function minimax(board, player) {
    const opponent = player === 'X' ? 'O' : 'X';
    let bestMove = null;
    let bestScore = (player === 'O') ? -Infinity : Infinity;

    // Loop through all possible moves
    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            // Make the move
            board[i] = player;

            // Recursively call minimax
            const score = minimaxScore(board, player);

            // Undo the move
            board[i] = '';

            // Update the best move based on the score
            if ((player === 'O' && score > bestScore) || (player === 'X' && score < bestScore)) {
                bestScore = score;
                bestMove = { index: i };
            }
        }
    }
    return bestMove;
}

// Evaluate the board's score
function minimaxScore(board, player) {
    if (checkWinner(board)) {
        return player === 'O' ? 1 : -1;  // 1 for AI win, -1 for player win
    } else if (board.every(cell => cell !== '')) {
        return 0;  // Draw
    }
    return 0;  // Neutral score for ongoing game
}

// Check for a winner
function checkWinner(board) {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    return winningCombinations.some(combination => {
        const [a, b, c] = combination;
        return board[a] && board[a] === board[b] && board[a] === board[c];
    });
}
