function isSameDate(datePublished){
   // Function to calculate the time difference between current time and UTC time

  const currentdatePublished = new Date().toISOString(); // Get current time in UTC
  const datePublishedObj = new Date(datePublished); // Convert UTC time string to Date object

  // Calculate the time difference in milliseconds
  const timeDiff = new Date(currentdatePublished) - datePublishedObj;

  // Convert the time difference to a human-readable format
  const seconds = Math.floor(timeDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  // Return the time difference as an object
  if(hours<24){
    return true
  }else{
    return false
  }
}
export { isSameDate };