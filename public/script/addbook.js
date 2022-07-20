
var deletedArr = document.querySelectorAll(".delete");
var editArr = document.querySelectorAll(".edit");
var cardArr=document.querySelectorAll(".card")


deletedArr.forEach(function(item)
{
  
  item.addEventListener("click",function(event)
  {
 
    deleteBook(event.target.getAttribute("id"));
      
  })

})



function deleteBook(id)
{
  console.log("in delete book",id)
  var request = new XMLHttpRequest();

  request.open("post", "/deleteBook");
  request.setRequestHeader("Content-type","application/json");
  request.send(JSON.stringify({ id: id }));

  request.addEventListener("load", function()
  {
    if(request.status === 401)
    {
      alert("Please Sign In First!");
      window.location.href = "/signin";
    }
    else if (request.status === 200)
    {
      console.log("Successful")
    }

  
  })
}