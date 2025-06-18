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