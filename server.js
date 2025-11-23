const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increase limit for image uploads
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static('.')); // Serve static files from current directory

// Data file paths
const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const QUESTIONS_FILE = path.join(DATA_DIR, 'questions.json');
const CODES_FILE = path.join(DATA_DIR, 'code-snippets.json');

// Ensure data directory and files exist
async function initializeDataFiles() {
    try {
        await fs.mkdir(DATA_DIR, { recursive: true });

        // Initialize files if they don't exist
        const files = [
            { path: USERS_FILE, data: [] },
            { path: QUESTIONS_FILE, data: [] },
            { path: CODES_FILE, data: [] },
            { path: POSTS_FILE, data: [] }
        ];

        for (const file of files) {
            try {
                await fs.access(file.path);
            } catch {
                await fs.writeFile(file.path, JSON.stringify(file.data, null, 2));
            }
        }

        // Seed a default user if no users exist
        const users = await readData(USERS_FILE);
        if (users.length === 0) {
            const defaultPassword = 'password123';
            const hashedPassword = await bcrypt.hash(defaultPassword, 10);
            const defaultUser = {
                id: Date.now().toString(),
                name: 'Test User',
                email: 'test@example.com',
                password: hashedPassword,
                createdAt: new Date().toISOString(),
                reputation: 0
            };
            users.push(defaultUser);
            await writeData(USERS_FILE, users);
            console.log('✓ Default test user created (email: test@example.com, password: password123)');
        }

        console.log('✓ Data files initialized');
    } catch (error) {
        console.error('Error initializing data files:', error);
    }
}

// Helper functions for data access
async function readData(filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading ${filePath}:`, error);
        return [];
    }
}

async function writeData(filePath, data) {
    try {
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error(`Error writing ${filePath}:`, error);
        return false;
    }
}

// Authentication middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access token required' });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'dev-secret-key', (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = user;
        next();
    });
}

// Helper function to award reputation
async function awardReputation(userId, points, reason) {
    try {
        const users = await readData(USERS_FILE);
        const user = users.find(u => u.id === userId);

        if (user) {
            if (!user.reputation) user.reputation = 0;
            user.reputation += points;
            if (user.reputation < 0) user.reputation = 0;

            await writeData(USERS_FILE, users);
            console.log(`✓ Awarded ${points} reputation to ${user.name} for: ${reason}`);
        }
    } catch (error) {
        console.error('Error awarding reputation:', error);
    }
}

// ===================================
// Authentication Routes
// ===================================

// Register
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const users = await readData(USERS_FILE);

        // Check if user already exists
        if (users.find(u => u.email === email)) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            password: hashedPassword,
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        await writeData(USERS_FILE, users);

        // Generate token
        const token = jwt.sign(
            { id: newUser.id, email: newUser.email },
            process.env.JWT_SECRET || 'dev-secret-key',
            { expiresIn: '7d' }
        );

        // Return user without password
        const { password: _, ...userWithoutPassword } = newUser;

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: userWithoutPassword
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Registration failed' });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const users = await readData(USERS_FILE);
        const user = users.find(u => u.email === email);

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check password
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET || 'dev-secret-key',
            { expiresIn: '7d' }
        );

        // Return user without password
        const { password: _, ...userWithoutPassword } = user;

        res.json({
            message: 'Login successful',
            token,
            user: userWithoutPassword
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Login failed' });
    }
});

// Get profile
app.get('/api/auth/profile', authenticateToken, async (req, res) => {
    try {
        const users = await readData(USERS_FILE);
        const user = users.find(u => u.id === req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { password: _, ...userWithoutPassword } = user;
        res.json({ user: userWithoutPassword });
    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).json({ message: 'Failed to get profile' });
    }
});

// ===================================
// Questions Routes
// ===================================

// Get all questions
app.get('/api/questions', async (req, res) => {
    try {
        const questions = await readData(QUESTIONS_FILE);
        res.json({ questions });
    } catch (error) {
        console.error('Get questions error:', error);
        res.status(500).json({ message: 'Failed to get questions' });
    }
});

// Get single question
app.get('/api/questions/:id', async (req, res) => {
    try {
        const questions = await readData(QUESTIONS_FILE);
        const question = questions.find(q => q.id === req.params.id);

        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        res.json({ question });
    } catch (error) {
        console.error('Get question error:', error);
        res.status(500).json({ message: 'Failed to get question' });
    }
});

// Create question
app.post('/api/questions', authenticateToken, async (req, res) => {
    try {
        const { title, content, code, language, tags, getAIAnswer } = req.body;

        if (!title || !content) {
            return res.status(400).json({ message: 'Title and content are required' });
        }

        const users = await readData(USERS_FILE);
        const user = users.find(u => u.id === req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Create new question
        const newQuestion = {
            id: Date.now().toString(),
            title,
            content,
            code: code || '',
            language: language || 'javascript',
            tags: tags || [],
            author: user.name,
            authorId: user.id,
            createdAt: new Date().toISOString(),
            views: 0,
            upvotes: 0,
            downvotes: 0,
            answers: [],
            hasAIAnswer: false,
            aiAnswer: null
        };

        // Get AI answer if requested
        if (getAIAnswer) {
            const aiAnswer = await generateAIAnswer(title, content, code, language);
            if (aiAnswer) {
                newQuestion.hasAIAnswer = true;
                newQuestion.aiAnswer = aiAnswer;
            }
        }

        const questions = await readData(QUESTIONS_FILE);
        questions.unshift(newQuestion); // Add to beginning
        await writeData(QUESTIONS_FILE, questions);

        // Award reputation for asking a question
        await awardReputation(user.id, 5, 'Asked a question');

        res.status(201).json({
            message: 'Question created successfully',
            question: newQuestion
        });
    } catch (error) {
        console.error('Create question error:', error);
        res.status(500).json({ message: 'Failed to create question' });
    }
});

// Add answer to question
app.post('/api/questions/:id/answers', authenticateToken, async (req, res) => {
    try {
        const { content, code, language } = req.body;

        if (!content) {
            return res.status(400).json({ message: 'Answer content is required' });
        }

        const users = await readData(USERS_FILE);
        const user = users.find(u => u.id === req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const questions = await readData(QUESTIONS_FILE);
        const question = questions.find(q => q.id === req.params.id);

        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        // Create new answer
        const newAnswer = {
            id: Date.now().toString(),
            questionId: req.params.id,
            content,
            code: code || '',
            language: language || 'javascript',
            author: user.name,
            authorId: user.id,
            createdAt: new Date().toISOString(),
            upvotes: 0,
            downvotes: 0,
            isAccepted: false
        };

        question.answers.push(newAnswer);
        await writeData(QUESTIONS_FILE, questions);

        // Award reputation for answering a question
        await awardReputation(user.id, 10, 'Answered a question');

        res.status(201).json({
            message: 'Answer added successfully',
            answer: newAnswer
        });
    } catch (error) {
        console.error('Add answer error:', error);
        res.status(500).json({ message: 'Failed to add answer' });
    }
});

// Vote on question
app.put('/api/questions/:id/vote', authenticateToken, async (req, res) => {
    try {
        const { voteType } = req.body;

        const questions = await readData(QUESTIONS_FILE);
        const question = questions.find(q => q.id === req.params.id);

        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        if (voteType === 'up') {
            question.upvotes++;
        } else if (voteType === 'down') {
            question.downvotes++;
        }

        await writeData(QUESTIONS_FILE, questions);

        res.json({
            message: 'Vote recorded',
            question
        });
    } catch (error) {
        console.error('Vote error:', error);
        res.status(500).json({ message: 'Failed to record vote' });
    }
});

// ===================================
// Code Upload Routes
// ===================================

// Upload code
app.post('/api/code/upload', authenticateToken, async (req, res) => {
    try {
        const { title, description, code, language, tags, visibility, getAIReview } = req.body;

        if (!title || !description || !code) {
            return res.status(400).json({ message: 'Title, description, and code are required' });
        }

        const users = await readData(USERS_FILE);
        const user = users.find(u => u.id === req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Create new code snippet
        const newSnippet = {
            id: Date.now().toString(),
            title,
            description,
            code,
            language: language || 'javascript',
            tags: tags || [],
            visibility: visibility || 'public',
            author: user.name,
            authorId: user.id,
            createdAt: new Date().toISOString(),
            aiReview: null
        };

        // Get AI code review if requested
        if (getAIReview) {
            const aiReview = await generateAICodeReview(code, language);
            if (aiReview) {
                newSnippet.aiReview = aiReview;
            }
        }

        const snippets = await readData(CODES_FILE);
        snippets.unshift(newSnippet);
        await writeData(CODES_FILE, snippets);

        res.status(201).json({
            message: 'Code uploaded successfully',
            snippet: newSnippet
        });
    } catch (error) {
        console.error('Upload code error:', error);
        res.status(500).json({ message: 'Failed to upload code' });
    }
});

// Get code snippet
app.get('/api/code/:id', async (req, res) => {
    try {
        const snippets = await readData(CODES_FILE);
        const snippet = snippets.find(s => s.id === req.params.id);

        if (!snippet) {
            return res.status(404).json({ message: 'Code snippet not found' });
        }

        res.json({ snippet });
    } catch (error) {
        console.error('Get code error:', error);
        res.status(500).json({ message: 'Failed to get code snippet' });
    }
});

// Get user's code snippets
app.get('/api/code/user/:userId', async (req, res) => {
    try {
        const snippets = await readData(CODES_FILE);
        const userSnippets = snippets.filter(s => s.authorId === req.params.userId);

        res.json({ snippets: userSnippets });
    } catch (error) {
        console.error('Get user code error:', error);
        res.status(500).json({ message: 'Failed to get user code' });
    }
});

// ===================================
// Community Routes
// ===================================

const POSTS_FILE = path.join(DATA_DIR, 'community-posts.json');

// Get all community posts
app.get('/api/community/posts', async (req, res) => {
    try {
        const posts = await readData(POSTS_FILE);
        res.json({ posts: posts || [] });
    } catch (error) {
        console.error('Get posts error:', error);
        res.status(500).json({ message: 'Failed to get posts' });
    }
});

// Create community post
app.post('/api/community/posts', authenticateToken, async (req, res) => {
    try {
        const { content, code, language, tags, image } = req.body;

        if (!content) {
            return res.status(400).json({ message: 'Content is required' });
        }

        const users = await readData(USERS_FILE);
        const user = users.find(u => u.id === req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const newPost = {
            id: Date.now().toString(),
            content,
            code: code || '',
            language: language || 'javascript',
            tags: tags || [],
            image: image || null,
            author: user.name,
            authorId: user.id,
            createdAt: new Date().toISOString(),
            likes: [],
            comments: []
        };

        let posts = await readData(POSTS_FILE);
        if (!Array.isArray(posts)) posts = [];
        posts.unshift(newPost);
        await writeData(POSTS_FILE, posts);

        // Award reputation for creating a post
        await awardReputation(user.id, 3, 'Created a community post');

        res.status(201).json({
            message: 'Post created successfully',
            post: newPost
        });
    } catch (error) {
        console.error('Create post error:', error);
        res.status(500).json({ message: 'Failed to create post' });
    }
});

// Like/Unlike post
app.post('/api/community/posts/:id/like', authenticateToken, async (req, res) => {
    try {
        let posts = await readData(POSTS_FILE);
        if (!Array.isArray(posts)) posts = [];

        const post = posts.find(p => p.id === req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const userIndex = post.likes.indexOf(req.user.id);

        if (userIndex > -1) {
            // Unlike
            post.likes.splice(userIndex, 1);
        } else {
            // Like
            post.likes.push(req.user.id);
        }

        await writeData(POSTS_FILE, posts);

        res.json({
            message: 'Like toggled',
            post
        });
    } catch (error) {
        console.error('Like error:', error);
        res.status(500).json({ message: 'Failed to toggle like' });
    }
});

// Add comment to post
app.post('/api/community/posts/:id/comment', authenticateToken, async (req, res) => {
    try {
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({ message: 'Comment content is required' });
        }

        const users = await readData(USERS_FILE);
        const user = users.find(u => u.id === req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let posts = await readData(POSTS_FILE);
        if (!Array.isArray(posts)) posts = [];

        const post = posts.find(p => p.id === req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const newComment = {
            id: Date.now().toString(),
            content,
            author: user.name,
            authorId: user.id,
            createdAt: new Date().toISOString()
        };

        post.comments.push(newComment);
        await writeData(POSTS_FILE, posts);

        res.status(201).json({
            message: 'Comment added',
            comment: newComment
        });
    } catch (error) {
        console.error('Comment error:', error);
        res.status(500).json({ message: 'Failed to add comment' });
    }
});

// Delete post
app.delete('/api/community/posts/:id', authenticateToken, async (req, res) => {
    try {
        let posts = await readData(POSTS_FILE);
        if (!Array.isArray(posts)) posts = [];

        const postIndex = posts.findIndex(p => p.id === req.params.id);

        if (postIndex === -1) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if user owns the post
        if (posts[postIndex].authorId !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this post' });
        }

        posts.splice(postIndex, 1);
        await writeData(POSTS_FILE, posts);

        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Delete post error:', error);
        res.status(500).json({ message: 'Failed to delete post' });
    }
});

// ===================================
// Profile Management Routes
// ===================================

// Update profile
app.put('/api/profile/update', authenticateToken, async (req, res) => {
    try {
        const { name, bio, location, website, github, twitter } = req.body;

        const users = await readData(USERS_FILE);
        const user = users.find(u => u.id === req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user profile
        if (name) user.name = name;
        if (bio !== undefined) user.bio = bio;
        if (location !== undefined) user.location = location;
        if (website !== undefined) user.website = website;
        if (github !== undefined) user.github = github;
        if (twitter !== undefined) user.twitter = twitter;

        await writeData(USERS_FILE, users);

        const { password: _, ...userWithoutPassword } = user;

        res.json({
            message: 'Profile updated successfully',
            user: userWithoutPassword
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Failed to update profile' });
    }
});

// Update profile photo
app.post('/api/profile/photo', authenticateToken, async (req, res) => {
    try {
        const { photo } = req.body;

        if (!photo) {
            return res.status(400).json({ message: 'Photo data is required' });
        }

        const users = await readData(USERS_FILE);
        const user = users.find(u => u.id === req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.profilePhoto = photo;
        await writeData(USERS_FILE, users);

        res.json({
            message: 'Profile photo updated successfully',
            photo
        });
    } catch (error) {
        console.error('Update photo error:', error);
        res.status(500).json({ message: 'Failed to update profile photo' });
    }
});

// Update cover photo
app.post('/api/profile/cover', authenticateToken, async (req, res) => {
    try {
        const { cover } = req.body;

        if (!cover) {
            return res.status(400).json({ message: 'Cover data is required' });
        }

        const users = await readData(USERS_FILE);
        const user = users.find(u => u.id === req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.coverPhoto = cover;
        await writeData(USERS_FILE, users);

        res.json({
            message: 'Cover photo updated successfully',
            cover
        });
    } catch (error) {
        console.error('Update cover error:', error);
        res.status(500).json({ message: 'Failed to update cover photo' });
    }
});

// Update settings
app.put('/api/profile/settings', authenticateToken, async (req, res) => {
    try {
        const { publicProfile, showEmail, emailNotifications, followerNotifications } = req.body;

        const users = await readData(USERS_FILE);
        const user = users.find(u => u.id === req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (publicProfile !== undefined) user.publicProfile = publicProfile;
        if (showEmail !== undefined) user.showEmail = showEmail;
        if (emailNotifications !== undefined) user.emailNotifications = emailNotifications;
        if (followerNotifications !== undefined) user.followerNotifications = followerNotifications;

        await writeData(USERS_FILE, users);

        res.json({
            message: 'Settings updated successfully'
        });
    } catch (error) {
        console.error('Update settings error:', error);
        res.status(500).json({ message: 'Failed to update settings' });
    }
});

// Add reputation points
app.post('/api/profile/reputation', authenticateToken, async (req, res) => {
    try {
        const { points, reason } = req.body;

        const users = await readData(USERS_FILE);
        const user = users.find(u => u.id === req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.reputation) user.reputation = 0;
        user.reputation += points;

        // Ensure reputation doesn't go below 0
        if (user.reputation < 0) user.reputation = 0;

        await writeData(USERS_FILE, users);

        res.json({
            message: 'Reputation updated',
            reputation: user.reputation
        });
    } catch (error) {
        console.error('Update reputation error:', error);
        res.status(500).json({ message: 'Failed to update reputation' });
    }
});

// ===================================
// AI Integration
// ===================================

async function generateAIAnswer(title, content, code, language) {
    try {
        // This is a placeholder for AI integration
        // You would integrate with OpenAI, Gemini, or other AI service here

        // For now, return a simulated AI response
        const simulatedAnswer = `Based on your question "${title}", here are some suggestions:\n\n` +
            `1. Check the official documentation for the technology you're using.\n` +
            `2. Make sure you're following best practices for ${language || 'your programming language'}.\n` +
            `3. Consider edge cases and error handling in your implementation.\n\n` +
            `Note: This is a simulated AI response. To enable real AI answers, configure your AI service API key in the .env file.`;

        return simulatedAnswer;
    } catch (error) {
        console.error('AI answer generation error:', error);
        return null;
    }
}

async function generateAICodeReview(code, language) {
    try {
        // Placeholder for AI code review
        const simulatedReview = `Code Review for ${language}:\n\n` +
            `✓ Code structure looks good\n` +
            `✓ Consider adding more comments for complex logic\n` +
            `✓ Ensure proper error handling\n\n` +
            `Note: This is a simulated AI review. Configure your AI service API key for detailed reviews.`;

        return simulatedReview;
    } catch (error) {
        console.error('AI code review error:', error);
        return null;
    }
}

// ===================================
// Server Initialization
// ===================================

async function startServer() {
    await initializeDataFiles();

    app.listen(PORT, () => {
        console.log('');
        console.log('╔═══════════════════════════════════════════╗');
        console.log('║       DevConnect Server Running!          ║');
        console.log('╚═══════════════════════════════════════════╝');
        console.log('');
        console.log(`🚀 Server:  http://localhost:${PORT}`);
        console.log(`📱 API:     http://localhost:${PORT}/api`);
        console.log('');
        console.log('✓ Authentication endpoints ready');
        console.log('✓ Questions endpoints ready');
        console.log('✓ Code upload endpoints ready');
        console.log('✓ Community endpoints ready');
        console.log('✓ Profile management endpoints ready');
        console.log('');
        console.log('Press Ctrl+C to stop the server');
        console.log('');
    });
}

startServer();
