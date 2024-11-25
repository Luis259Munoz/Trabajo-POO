const users = [];
    let loggedInUser = null;
    let editingServiceIndex = null;

    // Funciones
    function togglePasswordVisibility(passwordFieldId) {
      const passwordField = document.getElementById(passwordFieldId);
      const button = passwordField.nextElementSibling;
      passwordField.type = passwordField.type === 'password' ? 'text' : 'password';
      button.textContent = passwordField.type === 'password' ? '👁' : '🙈';
    }

    document.getElementById('createUserForm').addEventListener('submit', function (e) {
      e.preventDefault();
      const firstName = document.getElementById('firstName').value;
      const lastName = document.getElementById('lastName').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      if (users.some(user => user.email === email)) {
        alert('Este correo ya está registrado.');
        return;
      }
      users.push({ firstName, lastName, email, password, services: [] });
      alert('Usuario creado exitosamente.');
      document.getElementById('loginEmail').value = email;
      document.getElementById('loginPassword').value = password;
      this.reset();
    });

    document.getElementById('loginForm').addEventListener('submit', function (e) {
      e.preventDefault();
      const loginEmail = document.getElementById('loginEmail').value;
      const loginPassword = document.getElementById('loginPassword').value;

      const user = users.find(user => user.email === loginEmail && user.password === loginPassword);
      if (user) {
        alert(`Bienvenido, ${user.firstName}!`);
        loggedInUser = user;
        document.getElementById('serviceSection').classList.remove('hidden');
      } else {
        alert('Correo o contraseña incorrectos.');
      }
    });

    document.getElementById('createServiceBtn').addEventListener('click', () => {
      document.getElementById('createServiceForm').classList.toggle('hidden');
    });

    document.getElementById('viewServicesBtn').addEventListener('click', () => {
      const servicesList = document.getElementById('servicesUl');
      servicesList.innerHTML = '';
      loggedInUser.services.forEach((service, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
          <strong>${service.name}</strong> (${service.type})
          <button onclick="editService(${index})">Editar</button>
        `;
        servicesList.appendChild(li);
      });
      document.getElementById('servicesList').classList.toggle('hidden');
    });

    document.getElementById('serviceForm').addEventListener('submit', function (e) {
      e.preventDefault();
      const service = {
        name: document.getElementById('serviceName').value,
        location: document.getElementById('serviceLocation').value,
        contact: document.getElementById('serviceContact').value,
        type: document.getElementById('serviceType').value,
        description: document.getElementById('serviceDescription').value,
      };
      loggedInUser.services.push(service);
      alert('Servicio creado exitosamente.');
      this.reset();
      document.getElementById('createServiceForm').classList.add('hidden');
    });

    document.getElementById('editForm').addEventListener('submit', function (e) {
      e.preventDefault();
      const service = loggedInUser.services[editingServiceIndex];
      service.name = document.getElementById('editServiceName').value;
      service.location = document.getElementById('editServiceLocation').value;
      service.contact = document.getElementById('editServiceContact').value;
      service.type = document.getElementById('editServiceType').value;
      service.description = document.getElementById('editServiceDescription').value;

      alert('Servicio actualizado exitosamente.');
      document.getElementById('editServiceForm').classList.add('hidden');
      document.getElementById('viewServicesBtn').click();
    });

    function editService(index) {
      editingServiceIndex = index;
      const service = loggedInUser.services[index];
      document.getElementById('editServiceName').value = service.name;
      document.getElementById('editServiceLocation').value = service.location;
      document.getElementById('editServiceContact').value = service.contact;
      document.getElementById('editServiceType').value = service.type;
      document.getElementById('editServiceDescription').value = service.description;

      document.getElementById('editServiceForm').classList.remove('hidden');
    }

    function deleteService(index) {
      if (confirm('¿Estás seguro de que deseas eliminar este servicio?')) {
        loggedInUser.services.splice(index, 1);
        alert('Servicio eliminado exitosamente.');
        document.getElementById('viewServicesBtn').click();
      }
    }