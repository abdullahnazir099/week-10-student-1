 // Extract contact ID from the URL parameters
 const urlParams = new URLSearchParams(window.location.search);
 const contactId = urlParams.get('id');

 // Fetch contact information based on the ID
 const fetchContact = async () => {
     try {
         const response = await fetch(`/.netlify/functions/contact_read?id=${contactId}`);
         if (!response.ok) {
             throw new Error('Failed to fetch contact');
         }
         const data = await response.json();
         // Update form fields with fetched contact information
         document.getElementById('contactId').value = data.id;
         document.getElementById('contactName').value = data.first_name + ' ' + data.last_name;
         document.getElementById('contactEmail').value = data.email;
         document.getElementById('contactPhone').value = data.phone;
     } catch (error) {
         console.error('Error fetching contact:', error);
     }
 };

 // Call fetchContact function when the page loads
 window.onload = fetchContact;

 // Function to handle form submission for updating contact details
 const updateContact = async (event) => {
     event.preventDefault(); // Prevent default form submission behavior

     // Get form data
     const contactName = document.getElementById('contactName').value;
     const [firstName, lastName] = contactName.split(' ');
     const email = document.getElementById('contactEmail').value;
     const phone = document.getElementById('contactPhone').value;

     // Make POST request to serverless function to update contact
     try {
         const response = await fetch('/.netlify/functions/contact_update', {
             method: 'POST',
             headers: {
               'Content-Type': 'application/json',
             },
             body: JSON.stringify({ id: contactId, firstName, lastName, email, phone }),
         });
         
         if (response.ok) {
             alert('Contact updated successfully!');
             // Redirect back to Contacts page after successful update
             window.location.href = 'contacts.html';
         } else {
             throw new Error('Failed to update contact');
         }
     } catch (error) {
         console.error('Error:', error.message);
         alert('Failed to update contact. Please try again.');
     }
 };

 // Attach event listener to the form submit button
 document.getElementById('saveChangesBtn').addEventListener('click', updateContact);
