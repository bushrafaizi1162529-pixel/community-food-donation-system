const express = require('express');
const cors = require('cors');
require('dotenv').config();

const supabase = require('./supabaseClient');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('FoodShare Backend Running 🚀');
});

app.get('/test-db', async (req, res) => {
    const { data, error } = await supabase
        .from('users')
        .select('*');

    if (error) {
        return res.status(500).json(error);
    }

    res.json(data);
});
//testdb
app.post('/register', async (req, res) => {
    const { name, email, phone, role } = req.body;

    const { data, error } = await supabase
        .from('users')
        .insert([
            {
                name,
                email,
                phone,
                role
            }
        ])
        .select();

    if (error) {
        return res.status(500).json(error);
    }

    res.status(201).json(data);
});

app.get('/users', async (req, res) => {
    const { data, error } = await supabase
        .from('users')
        .select('*');

    if (error) {
        return res.status(500).json(error);
    }

    res.status(200).json(data);
});

app.get('/food', async (req, res) => {
    const { data, error } = await supabase
        .from('food_donations')
        .select('*');

    if (error) return res.status(500).json(error);

    res.status(200).json(data);
});

app.get('/food/:id', async (req, res) => {
    const { id } = req.params;

    const { data, error } = await supabase
        .from('food_donations')
        .select('*')
        .eq('id', id)
        .single();

    if (error) return res.status(500).json(error);

    res.status(200).json(data);
});

app.put('/food/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const { data, error } = await supabase
        .from('food_donations')
        .update({ status })
        .eq('id', id)
        .select('*');

    if (error) return res.status(500).json(error);

    res.status(200).json(data);
});

app.post('/food', async (req, res) => {
    const {
        food_name,
        quantity,
        description,
        expiry_time,
        location,
        latitude,
        longitude,
        donor_id
    } = req.body;

    const { data, error } = await supabase
        .from('food_donations')
        .insert([{
            food_name,
            quantity,
            description,
            expiry_time,
            location,
            latitude,
            longitude,
            donor_id,
            status: 'available'
        }])
        .select('*');

    if (error) return res.status(500).json(error);

    res.status(201).json(data);
});

app.delete('/food/:id', async (req, res) => {
    const { id } = req.params;

    const { data, error } = await supabase
        .from('food_donations')
        .delete()
        .eq('id', id);

    if (error) return res.status(500).json(error);

    res.status(200).json({ message: "Food deleted", data });
});

app.post('/pickup', async (req, res) => {
    const { food_id, ngo_id } = req.body;

    const { data, error } = await supabase
        .from('pickup_requests')
        .insert([
            {
                food_id,
                ngo_id,
                status: 'pending'
            }
        ])
        .select();

    if (error) {
        return res.status(500).json(error);
    }

    res.status(201).json(data);
});

app.put('/pickup/:id', async (req, res) => {
    const { id } = req.params;
    const { status, ngo_id } = req.body;

    // 1. update pickup status
    const { data, error } = await supabase
        .from('pickup_requests')
        .update({ status })
        .eq('id', id)
        .select();

    if (error) return res.status(500).json(error);

    // 2. AUTO NOTIFICATION LOGIC
    let message = "";

    if (status === "approved") {
        message = "Your food request has been APPROVED 🎉";
    } else if (status === "rejected") {
        message = "Your food request was REJECTED ❌";
    } else if (status === "completed") {
        message = "Food has been DELIVERED 🚚";
    }

    if (message) {
        await supabase
            .from('notifications')
            .insert([
                {
                    user_id: ngo_id,
                    message: message
                }
            ]);
    }

    res.status(200).json(data);
});

app.get('/notifications/:user_id', async (req, res) => {
    const { user_id } = req.params;

    const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user_id)
        .order('created_at', { ascending: false });

    if (error) {
        return res.status(500).json(error);
    }

    res.status(200).json(data);
});

app.post('/notifications', async (req, res) => {
    const { user_id, message } = req.body;

    const { data, error } = await supabase
        .from('notifications')
        .insert([
            {
                user_id,
                message
            }
        ])
        .select();

    if (error) {
        return res.status(500).json(error);
    }

    res.status(201).json(data);
});

app.get('/pickup', async (req, res) => {
    const { data, error } = await supabase
        .from('pickup_requests')
        .select('*');

    if (error) {
        return res.status(500).json(error);
    }

    res.status(200).json(data);
});

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});