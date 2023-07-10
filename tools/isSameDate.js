function isSameDate(PublishedAt){
    const dateString = PublishedAt;
    const dateObj = new Date(dateString);
    
    const currentDate = new Date();
    
    return (
      dateObj.getFullYear() === currentDate.getFullYear() &&
      dateObj.getMonth() === currentDate.getMonth() &&
      dateObj.getDate() === currentDate.getDate()
    );
}
export { isSameDate };