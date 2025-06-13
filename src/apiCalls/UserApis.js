export const registerUser = async (userData) => {
  try {
    console.log(userData);
    const response = await fetch('http://localhost:4500/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    console.log("Register Response", data);
    // if (!response.ok) {
    //   throw new Error(data.message || 'Registration failed');
    // }
    return data;
  } catch (error) {
    throw error;
  }
};