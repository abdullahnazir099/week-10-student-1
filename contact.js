// function showContacts() {
//     fetch('/.netlify/functions/allcontacts')
//         .then(response => response.json())
//         .then(contacts => {
//             const contactsContainer = document.getElementById('contacts-container');
//             const contactList = contacts.map(contact => `
//                 <tr>
//                     <td>${contact.first_name} ${contact.last_name}</td>
//                     <td>${contact.phone}</td>
//                     <td>${contact.email}</td>
//                     <td>
//                         <button class="btn btn-primary btn-sm" onclick="openEditModal(${contact.id})">Edit</button>
//                         <button class="btn btn-danger btn-sm" onclick="confirmDelete(${contact.id})">Delete</button>
//                     </td>
//                 </tr>
//             `).join('');
//             contactsContainer.innerHTML = `<table>${contactList}</table>`;
//         })
//         .catch(error => console.error('Error fetching contacts:', error));
// }

// document.addEventListener('DOMContentLoaded', showContacts);

// function addContact() {
//     const firstName = document.getElementById('firstName').value;
//     const lastName = document.getElementById('lastName').value;
//     const email = document.getElementById('email').value;
//     const phone = document.getElementById('phone').value;
//     const category = document.getElementById('category').value;

//     fetch('/.netlify/functions/createcontact', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ first_name: firstName, last_name: lastName, email, phone, category }),
//     })
//     .then(response => {
//         if (response.ok) {
//             $('#addContactModal').modal('hide');
//             showContacts();
//         }
//     })
//     .catch(error => console.error('Error adding contact:', error));
// }

// async function openEditModal(contactId) {
//     try {
//         const response = await fetch(`/.netlify/functions/readcontact?id=${contactId}`);
//         const contact = await response.json();

//         document.getElementById('editContactId').value = contact.id;
//         document.getElementById('editFirstName').value = contact.first_name;
//         document.getElementById('editLastName').value = contact.last_name;
//         document.getElementById('editEmail').value = contact.email;
//         document.getElementById('editPhone').value = contact.phone || '';
//         document.getElementById('editCategory').value = contact.category || '';

//         $('#editContactModal').modal('show');
//     } catch (error) {
//         console.error('Error fetching contact details:', error);
//     }
// }

// function updateContact() {
//     const id = document.getElementById('editContactId').value;
//     const firstName = document.getElementById('editFirstName').value;
//     const lastName = document.getElementById('editLastName').value;
//     const email = document.getElementById('editEmail').value;
//     const phone = document.getElementById('editPhone').value;
//     const category = document.getElementById('editCategory').value;

//     fetch('/.netlify/functions/updatecontact', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ id, first_name: firstName, last_name: lastName, email, phone, category }),
//     })
//     .then(response => {
//         if (response.ok) {
//             $('#editContactModal').modal('hide');
//             showContacts();
//         }
//     })
//     .catch(error => console.error('Error updating contact:', error));
// }

// function confirmDelete(contactId) {
//     if (confirm('Are you sure you want to delete this contact?')) {
//         fetch(`/.netlify/functions/deletecontact?id=${contactId}`, {
//             method: 'DELETE',
//         })
//         .then(response => {
//             if (response.ok) {
//                 showContacts();
//             }
//         })
//         .catch(error => console.error('Error deleting contact:', error));
//     }
// }






        // Function to fetch contacts from the serverless function
        const fetchContacts = async () => {
            try {
                const response = await fetch('/.netlify/functions/allcontacts');
                if (!response.ok) {
                    throw new Error('Failed to fetch contacts');
                }
                const data = await response.json();
                console.log('Fetched data:', data); // Debugging line
                // Ensure data is always an array
                return Array.isArray(data) ? data : [];
            } catch (error) {
                console.error('Error fetching contacts:', error);
                return []; // Return an empty array in case of error
            }
        };

        // Function to render contacts in the table
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

        // Initial render of contacts
        renderContacts();

        // Function to handle contact deletion
        const deleteContact = async (id) => {
            try {
                const response = await fetch(`/.netlify/functions/deletecontact?id=${id}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    alert('Contact deleted successfully!');
                    // Optionally, you can refresh the contact list or update UI after deletion
                    renderContacts(); // Assuming renderContacts function is defined to refresh the contact list
                } else {
                    throw new Error('Failed to delete contact');
                }
            } catch (error) {
                console.error('Error:', error.message);
                alert('Failed to delete contact. Please try again.');
            }
        };

        // Function to handle form submission for adding a contact
        const addContact = async (event) => {
            event.preventDefault(); // Prevent default form submission behavior

            // Get form data
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            
            // Make POST request to serverless function
            try {
                const response = await fetch('/.netlify/functions/createcontact', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ firstName, lastName, email, phone }),
                });
                
                if (response.ok) {
                    alert('Contact created successfully!');
                    // Optionally, you can redirect the user to another page after successful contact creation
                    renderContacts(); // Refresh contact list after adding a new contact
                    $('#addContactModal').modal('hide'); // Close the modal after successful submission
                } else {
                    throw new Error('Failed to create contact');
                }
            } catch (error) {
                console.error('Error:', error.message);
                alert('Failed to create contact. Please try again.');
            }
        };

        // Attach event listener to the form submit button
        document.getElementById('addContactBtn').addEventListener('click', addContact);
    