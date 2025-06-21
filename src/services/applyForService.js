import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import db from '../config/firestoreConfig'; // Import the configured Firestore instance

const applyForService = async (serviceType) => {
  const storedPhone = await AsyncStorage.getItem('userPhone');
  if (!storedPhone) {
    console.log('No user found');
    return;
  }

  const phone = storedPhone;
  const docRef = doc(db, 'users', phone); // Use the Firestore instance 'db'
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    const currentBalance = data.amount || 0;

    let serviceCost = 0;
    let serviceName = "";

    // Set the cost based on the service type
    if (serviceType === 'ambulance') {
      serviceCost = 100; // Cost for Free Ambulance
      serviceName = t.freeAmbulance;
    } else if (serviceType === 'loan') {
      serviceCost = 200; // Cost for Emergency Loan
      serviceName = t.loans;
    } else if (serviceType === 'checkup') {
      serviceCost = 150; // Cost for Full Medical Check-up
      serviceName = t.fullCheckup;
    }

    // Check if the user has enough coins
    if (currentBalance >= serviceCost) {
      try {
        // Deduct the coins
        const newBalance = currentBalance - serviceCost;
        await updateDoc(docRef, {
          amount: newBalance,  // Update the balance in Firestore
        });

        // Track the service request (you can create a new collection for tracking requests)
        const serviceRequestRef = doc(db, 'serviceRequests', phone + "_" + serviceType + "_" + Date.now());
        await setDoc(serviceRequestRef, {
          phone: phone,
          service: serviceName,
          cost: serviceCost,
          status: 'Pending', // Could be 'Pending', 'In Progress', 'Completed', etc.
          dateRequested: new Date(),
        });

        console.log(`Successfully applied for ${serviceName}`);
        alert(`${serviceName} request successfully submitted!`);
      } catch (error) {
        console.error('Error applying for service:', error);
      }
    } else {
      alert(`Insufficient coins for ${serviceName}`);
    }
  } else {
    console.log('No document found for this user');
  }
};

export default applyForService;