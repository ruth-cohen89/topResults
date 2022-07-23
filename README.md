<p align="center">

 <img width="350" height="160" src="https://railsware.com/blog/wp-content/uploads/2018/09/2400%D1%851260-rw-blog-node-js.png" />

 <img width="340" height="160" src="https://datasciencebiz.com/wp-content/uploads/2022/05/1_TTM5AleQfFJ-mItttJROdg.jpeg" />
 
</p>
<h1 align="center">topResults</h1>
<p align="center"><b><h4>A REST API for managing players and scores</h4></b></p>
</p>

<h2>Built with</h2>

* NodeJS - JS runtime environment

* Express - The web framework used

* MySql - relational database management system 

* Postman - API testing

<h2>How to run it?</h2>
  
* Clone this repository
  
* Install dependencies using command npm i
  
* Create databases by uncomentting the following lines on app.js:
  
  
   createUsersTable();
  
   createTopScoresTable();
  
* Run the code using command npm start

<h2>API Routes:</h2>

* Adduser

  POST http://127.0.0.1:8000/api/users/adduser
  
  Parameters: fullName, userName

* Submit

  POST http://127.0.0.1:800/api/users/submit
  
  Parameters: userName, game, result
  
* Top-scores

  GET http://127.0.0.1:800/api/users/submit?top-scores<number_of_scores>,game={game}
  
* Updateuser

  UPDATE http://127.0.0.1:800/api/users/updateuser:{userId}
  
  Parameters: fullName (optional), userName (optional)
  
