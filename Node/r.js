// // src/CrudForm.js
// import React, { useState } from 'react';
// import axios from 'axios';
 
// const CrudForm = () => {
//   const [inputValue, setInputValue] = useState('');
 
//   const handleInputChange = (e) => {
//     setInputValue(e.target.value);
//   };
 
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       // Replace with your API endpoint and adjust HTTP method/data as needed
//       const response = await axios.post('https://your-api-endpoint.com/data', {
//         data: inputValue,
//       });
//       console.log(response.data);
//       // Handle success, clear form, alert user, etc.
//     } catch (error) {
//       console.error('There was an error!', error);
//       // Handle error, alert user, etc.
//     }
//   };
 
//   return (
//     <form onSubmit={handleSubmit}>
//       <input
//         type="text"
//         value={inputValue}
//         onChange={handleInputChange}
//         placeholder="Enter data"
//       />
//       <button type="submit">Submit</button>
//     </form>
//   );
// };
 
// export default CrudForm;