// this makes the delete button clickable
// it has to be connected to the index file matching the class
$(document).ready(function(){
  $('.deleteUser').on('click', deleteUser);
});

function deleteUser(){
  // this ask the user a confirmation (Yes?or No?)
  var confirmation = confirm('Are you sure?');
  // take the confirmation and continues
  if(confirmation){
    // gets the id of what the user wants to delete
    $.ajax({
      type: 'DELETE',
      url: '/users/delete/' + $(this).data('id')
    }).done(function(response){
    });
    // this brings us back the normal page 
    window.location.replace('/');
  }else{
    return false;
  }
}
