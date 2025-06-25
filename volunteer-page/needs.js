document.addEventListener('DOMContentLoaded', function () {
    const needsContainer = document.getElementById('needsContainer');
    const searchInput = document.getElementById('searchInput');
    const helpTypeFilter = document.getElementById('helpTypeFilter');
    const emptyState = document.getElementById('emptyState');

    if (!needsContainer) return;

    let registeredNeeds = [];
    try {
        const savedData = localStorage.getItem('registeredNeeds');
        if (savedData) {
            registeredNeeds = JSON.parse(savedData);
        }
        console.log('Dados carregados:', registeredNeeds);
    } catch (e) {
        console.error('Erro ao ler dados:', e);
    }

    renderNeeds(registeredNeeds);
    if (searchInput) {
        searchInput.addEventListener('input', filterNeeds);
    }
    if (helpTypeFilter) {
        helpTypeFilter.addEventListener('change', filterNeeds);
    }

    function filterNeeds() {
        const searchTerm = searchInput.value.toLowerCase();
        const filterType = helpTypeFilter.value;

        const filteredNeeds = registeredNeeds.filter(need => {
            if (!need) return false; 
            const matchesSearch =
                (need.needTitle && need.needTitle.toLowerCase().includes(searchTerm)) ||
                (need.detailedDescription && need.detailedDescription.toLowerCase().includes(searchTerm));
            const matchesType = filterType ? need.helpType === filterType : true;

            return matchesSearch && matchesType;
        });

        renderNeeds(filteredNeeds);
    }

    function renderNeeds(needs) {
        needsContainer.innerHTML = '';
        console.log("Renderizando:", needs);

        const validNeeds = needs.filter(need => need && need.needTitle && need.helpType);

        if (validNeeds.length === 0) {
            emptyState.style.display = 'block';
            return;
        }
        emptyState.style.display = 'none';

        validNeeds.forEach(need => {
            const card = document.createElement('div');
            card.className = 'col-md-4';
            card.innerHTML = `
                <div class="card need-card mb-4">
                    <img src="../images/placeholder-need.jpg" class="card-img-top" alt="${need.needTitle}">
                    <div class="card-body">
                        <span class="badge bg-primary badge-type">${need.helpType}</span>
                        <h5 class="card-title">${need.needTitle}</h5>
                        <p class="card-text text-muted"><small>${need.institutionName}</small></p>
                        <p class="card-text">${need.detailedDescription.substring(0, 100)}...</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <small class="text-muted">${need.registrationDate ? new Date(need.registrationDate).toLocaleDateString() : ''}</small>
                            <button class="btn btn-sm btn-details" data-id="${need.id}">Ver detalhes</button>
                        </div>
                    </div>
                </div>
            `;
            needsContainer.appendChild(card);
        });

        document.querySelectorAll('.btn-details').forEach(button => {
            button.addEventListener('click', function () {
                const needId = parseInt(this.getAttribute('data-id'));
                viewNeedDetails(needId);
            });
        });
    }

    function viewNeedDetails(needId) {
        const need = registeredNeeds.find(n => n.id === needId);
        if (need) {
            alert(`Detalhes da necessidade:

Título: ${need.needTitle}
Instituição: ${need.institutionName}
Tipo: ${need.helpType}
Descrição: ${need.detailedDescription}

Contato: ${need.contact?.email || 'Email não informado'} ${need.contact?.phone ? '| ' + need.contact.phone : ''}`);
        }
    }
});
