const radios = document.getElementsByName("review_rating");
// for ( i = 0; i < radios.length; i++) {
//     if(radios[i] == locals.review_rating) {
//         radios[i].setAttribute(checked)
//     }
// }

// let reviewURL = "inventory/review"; 
// fetch(reviewURL) 
// .then(function (response) { 
//  if (response.ok) { 
//   return response.json(); 
//  } 
//  throw Error("Network response was not OK"); 
// }) 
// .then(function (data) { 
//  console.log(data);  
// }) 
// .catch(function (error) { 
//  console.log('There was a problem: ', error.message); 
// }) 

const form = document.getElementById('#add-review');

form.addEventListener('submit', function(event) {
  console.log(event);
});
