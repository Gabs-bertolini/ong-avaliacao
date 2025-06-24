let registeredNeeds = [];

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('success-message').style.display = 'none';
    document.getElementById('needsForm').style.display = 'block';

    document.getElementById('cep').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length > 5) {
            value = value.substring(0, 5) + '-' + value.substring(5, 8);
        }
        
        e.target.value = value;
        
        if (value.length === 9) {
            searchCEP(value);
        }
    });

    document.getElementById('needsForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const institutionName = document.getElementById('institutionName').value.trim();
        const helpType = document.getElementById('helpType').value;
        const needTitle = document.getElementById('needTitle').value.trim();
        const detailedDescription = document.getElementById('detailedDescription').value.trim();
        const cep = document.getElementById('cep').value.trim();
        const contactEmail = document.getElementById('contactEmail').value.trim();
        const contactPhone = document.getElementById('contactPhone').value.trim();
        
        if (!institutionName || !helpType || !needTitle || !detailedDescription || !cep || !contactEmail) {
            console.log('Por favor, preencha todos os campos obrigatórios');
            return;
        }   

        saveNeed(institutionName, helpType, needTitle, detailedDescription, cep, contactEmail, contactPhone);
    });
});

function searchCEP(cep) {
    cep = cep.replace('-', '');
    
    if (cep.length !== 8) {
        console.log('CEP inválido - deve conter 8 dígitos');
        return;
    }

    fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(response => response.json())
        .then(data => {
            if (!data.erro) {
                document.getElementById('street').value = data.logradouro || '';
                document.getElementById('neighborhood').value = data.bairro || '';
                document.getElementById('city').value = data.localidade || '';
                document.getElementById('state').value = data.uf || '';
                
                document.getElementById('contactEmail').focus();
            } else {
                console.log('CEP não encontrado');
            }
        })
        .catch(error => {
            console.error('Erro ao buscar CEP:', error);
        });
}

function saveNeed(institutionName, helpType, needTitle, detailedDescription, cep, contactEmail, contactPhone) {
    const newNeed = {
        id: Date.now(),
        institutionName,
        helpType,
        needTitle,
        detailedDescription,
        address: {
            cep,
            street: document.getElementById('street').value,
            neighborhood: document.getElementById('neighborhood').value,
            city: document.getElementById('city').value,
            state: document.getElementById('state').value
        },
        contact: {
            email: contactEmail,
            phone: contactPhone
        },
        registrationDate: new Date().toISOString()
    };
    
    registeredNeeds.push(newNeed);
    
    document.getElementById('needsForm').style.display = 'none';
    document.getElementById('success-message').style.display = 'block';
    
    console.log('Necessidade cadastrada:', newNeed);
}

function resetForm() {
    document.getElementById('needsForm').reset();
    document.getElementById('needsForm').style.display = 'block';
    document.getElementById('success-message').style.display = 'none';
    
    document.getElementById('street').value = '';
    document.getElementById('neighborhood').value = '';
    document.getElementById('city').value = '';
    document.getElementById('state').value = '';
    
    document.getElementById('institutionName').focus();
}