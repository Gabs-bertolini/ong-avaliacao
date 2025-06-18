let registeredNeeds = [];

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
