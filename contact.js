

const fetchContacts = async () => {
    try {
        const response = await fetch('/.netlify/functions/readcontact');
        if (!response.ok) {
            throw new Error('Failed to fetch contacts');
        }
        const data = await response.json();
        console.log('Fetched data:', data); // Debugging line

        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error('Error fetching contacts:', error);
        return [];
    }
};


const renderContacts = async () => {
    const contactList = document.getElementById('contactList');
    const contacts = await fetchContacts();
    contactList.innerHTML = contacts.map(contact => `
                <tr>
                    <td>${contact.id}</td>
                    <td>${contact.first_name} ${contact.last_name}</td>
                    <td>${contact.email}</td>
                    <td>${contact.phone}</td>
                    <td>
                        <a href="contact_view.html?id=${contact.id}" class="btn btn-primary btn-sm">View</a>
                        <button type="button" class="btn btn-danger btn-sm" onclick="deleteContact(${contact.id})">Delete</button>
                    </td>
                </tr>
            `).join('');
};

renderContacts();


const deleteContact = async (id) => {
    try {
        const response = await fetch(`/.netlify/functions/deletecontact?id=${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert('Contact deleted successfully!');

            renderContacts();
        } else {
            throw new Error('Failed to delete contact');
        }
    } catch (error) {
        console.error('Error:', error.message);
        alert('Failed to delete contact. Please try again.');
    }
};

const addContact = async (event) => {
    event.preventDefault();


    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;


    try {
          const user = netlifyIdentity.currentUser();
        const response = await fetch('/.netlify/functions/createcontact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ firstName, lastName, email, phone }),
        });

        if (response.ok) {
            alert('Contact created successfully!');

            renderContacts();
            $('#addContactModal').modal('hide');
        } else {
            throw new Error('Failed to create contact');
        }
    } catch (error) {
        console.error('Error:', error.message);
        alert('Failed to create contact. Please try again.');
    }
};


document.getElementById('addContactBtn').addEventListener('click', addContact);
