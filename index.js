const express = require("express");
const users = require("./MOCK_DATA.json");
const fs = require("fs");

const app = express();
//app.use(express.urlencoded({extended : false})); // for form data
app.use(express.json());    // for body json data





// get all user and rendered html
app.get("/user", (req, res) => {
  const html = `
  <table border='3'>
  <thead>
  <tr>
  <td> First Name </td>
  <td> Last Name </td>
  <td> Email </td>
  <td> Gender </td>
  </tr>
  </thead>
    
  <tbody>
  ${users
    .map(
      (user) =>
        `<tr> 
    <td> ${user.first_name} </td> 
    <td> ${user.last_name} </td> 
    <td> ${user.email} </td> 
    <td> ${user.gender} </td> 
    </tr>`
    )
    .join("")}
  </tbody>
  </table>`;

  res.send(html);
});





// get all user from json file
app.get("/api/user", (req, res) => {
  return res.json(users);
});





// get the particulr user data
app.get("/api/user/:id", (req, res) => {
  const reqid = Number(req.params.id);
  const userdata = users.find((user) => user.id === reqid);
  if (!userdata) {
    return res.json("id doesnot exist");
  }
  return res.json(userdata);
});






// add new user data
app.post("/api/user", (req, res) => {
  const body = req.body;

  emailexist = users.find((user) => user.email === body.email);
  if (emailexist) {
    return res.json("email already exist");
  }

  users.push({ ...body, id: users.length + 1 });
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
    if (err) {
      return res.json("something went wrong ", err);
    }
  });

  return res.status(200).json({
    success: true,
    id: users.length,
  });
});





// update user data
app.patch("/api/user/:id", (req, res) => {
  const reqId = Number(req.params.id);
  const body = req.body;

  const userData = users.find((user) => user.id === reqId);

  if (!userData) {
    return res.json("id does not exist");
  } else {
    userData.last_name = body.last_name;
    userData.email = body.email;

    // Now, persist the updated users array to the file
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => {
      if (err) {
        return res.json("something went wrong ", err);
      }

      return res.status(200).json({
        success: true,
        message: `${userData.first_name} data updated successfully`,
      });
    });
  }
});





//delet user
app.delete("/api/user/:id", (req, res) => {
  const reqId = Number(req.params.id);

  const updatedUsers = users.filter((user) => user.id !== reqId);

  // Check if any user was filtered out
  if (updatedUsers.length === users.length) {
    return res.status(404).json({ error: "User not found" });
  } else {

    fs.writeFile("./MOCK_DATA.json", JSON.stringify(updatedUsers), (err) => {
      if (err) {
        return res.json("something went wrong ", err);
      }

      return res.status(200).json({
        success: true,
        message: `user with ${reqId} deleted successfully`,
      });
    });
  }
});

app.get("/", (req, res) => {
  res.json("hey obaid here");
});

const port = 8000;
app.listen(port, () => {
  console.log(`server is listening at port ${port}`);
});
