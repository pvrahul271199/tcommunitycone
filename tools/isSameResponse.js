function isSameResponse(previousResponse, response) {
    if(previousResponse!==response.data.value){
         return true
    }else{
         return false
    }
 }

export { isSameResponse };