import mongoose from 'mongoose';

// Client Schema
const clientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: Number,
  phone: String,
  email: String,
  avatar: String,
  avatarColor: String,
  plan: String,
  startDate: String,
  endDate: String,
  remainingDays: Number,
  currentWeight: Number,
  goalWeight: Number,
  height: Number,
  status: String,
  goal: String,
  attendance: { type: Number, default: 0 }
});
// Remove __v and _id from JSON output, map _id to id
clientSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

// Daily Update Schema
const dailyUpdateSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
  name: String,
  avatar: String,
  avatarColor: String,
  date: String,
  workout: Boolean,
  workoutName: String,
  water: Number,
  calories: Number,
  sleep: Number,
  steps: Number,
  mood: String,
  notes: String,
  heartRate: Number
});
dailyUpdateSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

// Weight History Schema
const weightHistorySchema = new mongoose.Schema({
  date: String,
  weight: Number
});
weightHistorySchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

// Weight Table Data Schema
const weightTableDataSchema = new mongoose.Schema({
  date: String,
  weight: String,
  change: String,
  bmi: String
});
weightTableDataSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

// Notification Schema
const notificationSchema = new mongoose.Schema({
  message: String,
  time: String,
  read: { type: Boolean, default: false },
  type: String
});
notificationSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

// Chat Message Schema
const chatMessageSchema = new mongoose.Schema({
  text: String,
  sender: String,
  senderName: String,
  timestamp: String,
  time: String
});
chatMessageSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

export const Client = mongoose.model('Client', clientSchema);
export const DailyUpdate = mongoose.model('DailyUpdate', dailyUpdateSchema);
export const WeightHistory = mongoose.model('WeightHistory', weightHistorySchema);
export const WeightTableData = mongoose.model('WeightTableData', weightTableDataSchema);
export const Notification = mongoose.model('Notification', notificationSchema);
export const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);
