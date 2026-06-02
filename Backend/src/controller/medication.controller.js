import Medication from '../models/Medication.js';

export const addMedication = async (req, res) => {
  try {
    const medication = new Medication({
      ...req.body,
      userId: req.user._id
    });
    await medication.save();
    res.status(201).json(medication);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getMedications = async (req, res) => {
  try {
    const medications = await Medication.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(medications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateMedication = async (req, res) => {
  try {
    const medication = await Medication.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!medication) {
      return res.status(404).json({ error: 'Medication not found' });
    }
    res.json(medication);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteMedication = async (req, res) => {
  try {
    const medication = await Medication.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!medication) {
      return res.status(404).json({ error: 'Medication not found' });
    }
    res.json({ message: 'Medication deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const toggleMedicationActive = async (req, res) => {
  try {
    const medication = await Medication.findOne({ _id: req.params.id, userId: req.user._id });
    if (!medication) {
      return res.status(404).json({ error: 'Medication not found' });
    }
    medication.isActive = !medication.isActive;
    await medication.save();
    res.json(medication);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const takeDose = async (req, res) => {
  try {
    const medication = await Medication.findOne({ _id: req.params.id, userId: req.user._id });
    if (!medication) {
      return res.status(404).json({ error: 'Medication not found' });
    }
    
    if (medication.quantity > 0) {
      medication.quantity -= 1;
      await medication.save();
    }
    
    res.json(medication);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
