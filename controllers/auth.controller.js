import User from "../models/user.model.js";
import { fMsg, generateCode } from "../utils/libby.js";

export const saveUser = async (req, res, next) => {
  try {
    const { telegramId, username } = req.body;
    if (!telegramId || !username) {
      return next(new Error("Telegram ID and username are required"));
    }

    const existingUser = await User.findOne({ userId: telegramId });
    if (existingUser) {
      // Update existing user
      existingUser.userName = username;
      await existingUser.save();
      fMsg(res, "User updated successfully", existingUser, 200);
    } else {
      const randomCode = generateCode();
      const newUser = await User.create({
        userId: telegramId,
        userName: username,
        inviteCode: randomCode,
      });
      fMsg(res, "User saved successfully", newUser, 201);
    }
  } catch (error) {
    next(error);
  }
};
