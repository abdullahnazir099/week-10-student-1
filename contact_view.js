
 const urlParams = new URLSearchParams(window.location.search);
 const contactId = urlParams.get('id');


 const fetchContact = async () => {
     try {
         const response = await fetch(`/.netlify/functions/contact_read?id=${contactId}`);
         if (!response.ok) {
             throw new Error('Failed to fetch contact');
         }
         const data = await response.json();

         document.getElementById('contactId').value = data.id;
         document.getElementById('contactName').value = data.first_name + ' ' + data.last_name;
         document.getElementById('contactEmail').value = data.email;
         document.getElementById('contactPhone').value = data.phone;
     } catch (error) {
         console.error('Error fetching contact:', error);
     }
 };


 window.onload = fetchContact;


 const updateContact = async (event) => {
     event.preventDefault();
   
     const contactName = document.getElementById('contactName').value;
     const [firstName, lastName] = contactName.split(' ');
     const email = document.getElementById('contactEmail').value;
     const phone = document.getElementById('contactPhone').value;

     try {
         const response = await fetch('/.netlify/functions/updatecontact', {
             method: 'POST',
             headers: {
               'Content-Type': 'application/json',
             },
             body: JSON.stringify({ id: contactId, firstName, lastName, email, phone }),
         });
         
         if (response.ok) {
             alert('Contact updated successfully!');

             window.location.href = 'contacts.html';
         } else {
             throw new Error('Failed to update contact');
         }
     } catch (error) {
         console.error('Error:', error.message);
         alert('Failed to update contact. Please try again.');
     }
 };


 document.getElementById('saveChangesBtn').addEventListener('click', updateContact);
