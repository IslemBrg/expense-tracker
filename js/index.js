async function init() {
    await fetch('http://localhost:8000/database/create_table.php');
}

document.addEventListener('DOMContentLoaded', init);
