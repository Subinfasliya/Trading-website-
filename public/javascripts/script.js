function addToActive(personId,personName){
    $.ajax({
      url:'/admin/active-persons/'+personId,
      method:'get',
      success:(response)=>{
        if(response.status){
            alert("Adding " +personName)
            location.reload()
        }
       
      }
    })
  }