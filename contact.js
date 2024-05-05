function showContacts() {
    fetch('/.netlify/functions/allcontacts')
        .then(response => response.json())
        .then(contacts => {
            const contactsContainer = document.getElementById('contacts-container');
            const contactList = contacts.map(contact => `
                <tr>
                    <td>${contact.first_name} ${contact.last_name}</td>
                    <td>${contact.phone}</td>
                    <td>${contact.email}</td>
                    <td>
                        <button class="btn btn-primary btn-sm" onclick="openEditModal(${contact.id})">Edit</button>
                        <button class="btn btn-danger btn-sm" onclick="confirmDelete(${contact.id})">Delete</button>
                    </td>
                </tr>
            `).join('');
            contactsContainer.innerHTML = `<table>${contactList}</table>`;
        })
        .catch(error => console.error('Error fetching contacts:', error));
}

document.addEventListener('DOMContentLoaded', showContacts);

function addContact() {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const category = document.getElementById('category').value;

    fetch('/.netlify/functions/createcontact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ first_name: firstName, last_name: lastName, email, phone, category }),
    })
    .then(response => {
        if (response.ok) {
            $('#addContactModal').modal('hide');
            showContacts();
        }
    })
    .catch(error => console.error('Error adding contact:', error));
}

async function openEditModal(contactId) {
    try {
        const response = await fetch(`/.netlify/functions/readcontact?id=${contactId}`);
        const contact = await response.json();

        document.getElementById('editContactId').value = contact.id;
        document.getElementById('editFirstName').value = contact.first_name;
        document.getElementById('editLastName').value = contact.last_name;
        document.getElementById('editEmail').value = contact.email;
        document.getElementById('editPhone').value = contact.phone || '';
        document.getElementById('editCategory').value = contact.category || '';

        $('#editContactModal').modal('show');
    } catch (error) {
        console.error('Error fetching contact details:', error);
    }
}

function updateContact() {
    const id = document.getElementById('editContactId').value;
    const firstName = document.getElementById('editFirstName').value;
    const lastName = document.getElementById('editLastName').value;
    const email = document.getElementById('editEmail').value;
    const phone = document.getElementById('editPhone').value;
    const category = document.getElementById('editCategory').value;

    fetch('/.netlify/functions/updatecontact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, first_name: firstName, last_name: lastName, email, phone, category }),
    })
    .then(response => {
        if (response.ok) {
            $('#editContactModal').modal('hide');
            showContacts();
        }
    })
    .catch(error => console.error('Error updating contact:', error));
}

function confirmDelete(contactId) {
    if (confirm('Are you sure you want to delete this contact?')) {
        fetch(`/.netlify/functions/deletecontact?id=${contactId}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (response.ok) {
                showContacts();
            }
        })
        .catch(error => console.error('Error deleting contact:', error));
    }
}
