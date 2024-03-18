const searchInput = document.getElementById('searchInput');
const autocompleteList = document.getElementById('autocompleteList');
const repositoryList = document.getElementById('repositoryList');

let debounceTimer;

async function fetchRepositories(query) {
    const response = await fetch(`https://api.github.com/search/repositories?q=${query}`);
    const data = await response.json();
    return data.items.slice(0, 5);
}

function debounce(func, delay) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(func, delay);
}

function displayAutocomplete(repositories) {
    autocompleteList.innerHTML = '';
    repositories.forEach(repo => {
        const li = document.createElement('li');
        li.textContent = repo.full_name;
        li.addEventListener('click', () => {
            addRepository(repo);
            searchInput.value = '';
            autocompleteList.innerHTML = '';
        });
        autocompleteList.appendChild(li);
    });
}


function addRepository(repo) {
    const li = document.createElement('li');
    const repoInfoContainer = document.createElement('div');
    repoInfoContainer.classList.add('repo-info-container');
    
    // Название репозитория
    const nameInfo = document.createElement('div');
    nameInfo.textContent = `Название: ${repo.full_name}`;
    repoInfoContainer.appendChild(nameInfo);
    
    // Владелец репозитория
    const ownerInfo = document.createElement('div');
    ownerInfo.textContent = `Автор: ${repo.owner.login}`;
    repoInfoContainer.appendChild(ownerInfo);
    
    // Количество звезд
    const starsInfo = document.createElement('div');
    starsInfo.textContent = `Звезды: ${repo.stargazers_count}`;
    repoInfoContainer.appendChild(starsInfo);
    
     // Кнопка удаления с красным крестиком
     const removeButton = document.createElement('button');
     removeButton.textContent = '❌'; // Символ красного крестика
     removeButton.classList.add('remove-button');
     removeButton.addEventListener('click', () => {
         li.remove();
     });
     repoInfoContainer.appendChild(removeButton);
     
     li.appendChild(repoInfoContainer);
     repositoryList.appendChild(li);
 }

function removeRepository(button) {
    button.parentElement.remove();
}

searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim();
    if (query === '') {
        autocompleteList.innerHTML = '';
        return;
    }
    debounce(() => {
        fetchRepositories(query)
            .then(repositories => displayAutocomplete(repositories))
            .catch(error => console.error('Error fetching repositories:', error));
    }, 300);
});

