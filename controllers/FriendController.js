/**
 * Created by trungquandev.com's author on 16/10/2019.
 * src/controllers/Friend.js
 */
const debug = console.log.bind(console);
const Frends = require('../models/Frends');

let friendLists = async (req, res) => {
  debug(`Xác thực token hợp lệ, thực hiện giả lập lấy danh sách bạn bè của user và trả về cho người dùng...`);
  // Lưu ý khi làm thực tế thì việc lấy danh sách này là query tới DB để lấy nhé. Ở đây mình chỉ mock thôi.

  const friends = await Frends.find(); // Retrieve all friends from the database
  res.json(friends);
  // return res.status(200).json(friends);
}

let addFrend = (req, res) => {
  Frends.findOne({ name: req.body.name })
    .then(frend => {
      if (frend) {
        errors.push({ text: 'User already exist!' });
      } else {
        const newFrend = new Frends({
          name: req.body.name,
          age: req.body.age,
          address: req.body.address
        });
        newFrend.save().then(user => {
          return res.status(200).json();
        })
          .catch(err => console.log(err));

      }
    });
}

const editFriend = async (req, res) => {
  const friendId = req.params.id;
  const updatedData = req.body;

  try {
    // Get the friend by ID
    const existingFriend = await getFriendById(friendId);

    if (!existingFriend) {
      return res.status(404).json({ error: 'Friend not found' });
    }

    // Update the friend
    const updatedFriend = await updateFriend(friendId, updatedData);

    res.json(updatedFriend);
  } catch (error) {
    console.error('Error editing friend:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  friendLists: friendLists,
  addFrend: addFrend,
  editFriend: editFriend,
};