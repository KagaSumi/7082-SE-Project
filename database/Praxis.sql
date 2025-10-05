-- Create Database
CREATE DATABASE IF NOT EXISTS qa_platform;
USE qa_platform;

-- User Table
CREATE TABLE User (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    salt VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    score INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Course Table
CREATE TABLE Course (
    course_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Question Table
CREATE TABLE Question (
    question_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    view_count INT DEFAULT 0,
    is_anonymous BOOLEAN DEFAULT FALSE,
    score INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    course_id INT NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (course_id) REFERENCES Course(course_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE
);

-- Answer Table
CREATE TABLE Answer (
    answer_id INT AUTO_INCREMENT PRIMARY KEY,
    body TEXT NOT NULL,
    is_accepted BOOLEAN DEFAULT FALSE,
    score INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_anonymous BOOLEAN DEFAULT FALSE,
    question_id INT NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (question_id) REFERENCES Question(question_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE
);

-- Tag Table
CREATE TABLE Tag (
    tag_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- QuestionTag Junction Table (Many-to-Many relationship)
CREATE TABLE QuestionTag (
    tag_id INT NOT NULL,
    question_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (tag_id, question_id),
    FOREIGN KEY (tag_id) REFERENCES Tag(tag_id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES Question(question_id) ON DELETE CASCADE
);

-- Comment Table
CREATE TABLE Comment (
    comment_id INT AUTO_INCREMENT PRIMARY KEY,
    body TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INT NOT NULL,
    question_id INT,
    answer_id INT,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES Question(question_id) ON DELETE CASCADE,
    FOREIGN KEY (answer_id) REFERENCES Answer(answer_id) ON DELETE CASCADE,
    -- Constraint: must have either question_id or answer_id, but not both
    CONSTRAINT chk_comment_reference CHECK (
        (question_id IS NOT NULL AND answer_id IS NULL) OR 
        (question_id IS NULL AND answer_id IS NOT NULL)
    )
);

-- Votes Table
CREATE TABLE Votes (
    vote_id INT AUTO_INCREMENT PRIMARY KEY,
    vote_type ENUM('upvote', 'downvote') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INT NOT NULL,
    question_id INT,
    answer_id INT,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES Question(question_id) ON DELETE CASCADE,
    FOREIGN KEY (answer_id) REFERENCES Answer(answer_id) ON DELETE CASCADE,
    -- Constraint: must have either question_id or answer_id, but not both
    CONSTRAINT chk_vote_reference CHECK (
        (question_id IS NOT NULL AND answer_id IS NULL) OR 
        (question_id IS NULL AND answer_id IS NOT NULL)
    ),
    -- Unique constraint to prevent duplicate votes from same user on same content
    UNIQUE KEY unique_user_content (user_id, question_id, answer_id)
);

-- Trigger to update Question score when Votes are inserted
DELIMITER //
CREATE TRIGGER after_vote_insert_question
AFTER INSERT ON Votes
FOR EACH ROW
BEGIN
    IF NEW.question_id IS NOT NULL THEN
        UPDATE Question 
        SET score = (
            SELECT COUNT(CASE WHEN vote_type = 'upvote' THEN 1 END) - 
                   COUNT(CASE WHEN vote_type = 'downvote' THEN 1 END)
            FROM Votes 
            WHERE question_id = NEW.question_id
        )
        WHERE question_id = NEW.question_id;
        
        -- Update user score who posted the question
        UPDATE User u
        JOIN Question q ON u.user_id = q.user_id
        SET u.score = u.score + CASE WHEN NEW.vote_type = 'upvote' THEN 1 ELSE -1 END
        WHERE q.question_id = NEW.question_id;
    END IF;
END//
DELIMITER ;

-- Trigger to update Question score when Votes are deleted
DELIMITER //
CREATE TRIGGER after_vote_delete_question
AFTER DELETE ON Votes
FOR EACH ROW
BEGIN
    IF OLD.question_id IS NOT NULL THEN
        UPDATE Question 
        SET score = (
            SELECT COUNT(CASE WHEN vote_type = 'upvote' THEN 1 END) - 
                   COUNT(CASE WHEN vote_type = 'downvote' THEN 1 END)
            FROM Votes 
            WHERE question_id = OLD.question_id
        )
        WHERE question_id = OLD.question_id;
        
        -- Update user score who posted the question
        UPDATE User u
        JOIN Question q ON u.user_id = q.user_id
        SET u.score = u.score - CASE WHEN OLD.vote_type = 'upvote' THEN 1 ELSE -1 END
        WHERE q.question_id = OLD.question_id;
    END IF;
END//
DELIMITER ;

-- Trigger to update Answer score when Votes are inserted
DELIMITER //
CREATE TRIGGER after_vote_insert_answer
AFTER INSERT ON Votes
FOR EACH ROW
BEGIN
    IF NEW.answer_id IS NOT NULL THEN
        UPDATE Answer 
        SET score = (
            SELECT COUNT(CASE WHEN vote_type = 'upvote' THEN 1 END) - 
                   COUNT(CASE WHEN vote_type = 'downvote' THEN 1 END)
            FROM Votes 
            WHERE answer_id = NEW.answer_id
        )
        WHERE answer_id = NEW.answer_id;
        
        -- Update user score who posted the answer
        UPDATE User u
        JOIN Answer a ON u.user_id = a.user_id
        SET u.score = u.score + CASE WHEN NEW.vote_type = 'upvote' THEN 1 ELSE -1 END
        WHERE a.answer_id = NEW.answer_id;
    END IF;
END//
DELIMITER ;

-- Trigger to update Answer score when Votes are deleted
DELIMITER //
CREATE TRIGGER after_vote_delete_answer
AFTER DELETE ON Votes
FOR EACH ROW
BEGIN
    IF OLD.answer_id IS NOT NULL THEN
        UPDATE Answer 
        SET score = (
            SELECT COUNT(CASE WHEN vote_type = 'upvote' THEN 1 END) - 
                   COUNT(CASE WHEN vote_type = 'downvote' THEN 1 END)
            FROM Votes 
            WHERE answer_id = OLD.answer_id
        )
        WHERE answer_id = OLD.answer_id;
        
        -- Update user score who posted the answer
        UPDATE User u
        JOIN Answer a ON u.user_id = a.user_id
        SET u.score = u.score - CASE WHEN OLD.vote_type = 'upvote' THEN 1 ELSE -1 END
        WHERE a.answer_id = OLD.answer_id;
    END IF;
END//
DELIMITER ;

-- Trigger to update scores when an answer is accepted
DELIMITER //
CREATE TRIGGER after_answer_accepted
AFTER UPDATE ON Answer
FOR EACH ROW
BEGIN
    IF NEW.is_accepted = TRUE AND OLD.is_accepted = FALSE THEN
        -- Give points to the answer author
        UPDATE User 
        SET score = score + 15 
        WHERE user_id = NEW.user_id;
        
        -- Give points to the question author (if they accept someone else's answer)
        UPDATE User u
        JOIN Question q ON u.user_id = q.user_id
        SET u.score = u.score + 2
        WHERE q.question_id = NEW.question_id AND q.user_id != NEW.user_id;
    END IF;
END//
DELIMITER ;

-- Indexes for better performance
CREATE INDEX idx_question_course ON Question(course_id);
CREATE INDEX idx_question_user ON Question(user_id);
CREATE INDEX idx_answer_question ON Answer(question_id);
CREATE INDEX idx_answer_user ON Answer(user_id);
CREATE INDEX idx_comment_question ON Comment(question_id);
CREATE INDEX idx_comment_answer ON Comment(answer_id);
CREATE INDEX idx_comment_user ON Comment(user_id);
CREATE INDEX idx_votes_question ON Votes(question_id);
CREATE INDEX idx_votes_answer ON Votes(answer_id);
CREATE INDEX idx_votes_user ON Votes(user_id);
CREATE INDEX idx_questiontag_question ON QuestionTag(question_id);
CREATE INDEX idx_questiontag_tag ON QuestionTag(tag_id);

-- =============================================
-- COMPREHENSIVE DUMMY DATA
-- =============================================

-- Additional Users (FIRST)
INSERT INTO User (first_name, last_name, password, salt, email, score) VALUES
('Alice', 'Brown', 'hashed_password_4', 'salt4', 'alice.brown@email.com', 25),
('Charlie', 'Wilson', 'hashed_password_5', 'salt5', 'charlie.wilson@email.com', 42),
('Diana', 'Lee', 'hashed_password_6', 'salt6', 'diana.lee@email.com', 18),
('Ethan', 'Davis', 'hashed_password_7', 'salt7', 'ethan.davis@email.com', 35),
('Fiona', 'Garcia', 'hashed_password_8', 'salt8', 'fiona.garcia@email.com', 12);

-- Additional Courses (SECOND)
INSERT INTO Course (name, code) VALUES
('Database Systems', 'CS305'),
('Web Development', 'CS210'),
('Linear Algebra', 'MATH202'),
('Quantum Physics', 'PHY405');

-- Additional Tags (THIRD)
INSERT INTO Tag (name) VALUES
('database'),
('sql'),
('javascript'),
('nodejs'),
('homework-help'),
('exam-prep'),
('theory'),
('practice');

-- Questions (FOURTH - AFTER Users and Courses exist)
INSERT INTO Question (title, body, view_count, is_anonymous, score, course_id, user_id) VALUES
('How do I optimize MySQL queries?', 'I have a query that is running very slow on large datasets. What are some best practices for optimizing MySQL queries?', 156, FALSE, 8, 2, 1),  -- Computer Science, John
('Help with calculus integration', 'I am stuck on this integral: ∫(3x² + 2x - 1)dx from 0 to 5. Can someone explain the steps?', 89, FALSE, 5, 1, 2),  -- Mathematics, Jane
('Node.js Express routing not working', 'My Express routes are returning 404 even though I defined them correctly. Here is my code...', 234, FALSE, 12, 2, 3),  -- Computer Science, Bob
('Physics kinematics problem', 'A ball is thrown upward with initial velocity 20 m/s. How high does it go?', 67, TRUE, 3, 3, 1),  -- Physics, John
('Database normalization examples', 'Can someone provide real-world examples of 1NF, 2NF, and 3NF?', 178, FALSE, 15, 2, 2),  -- Computer Science, Jane
('JavaScript async/await confusion', 'I am confused about when to use async/await vs Promises. Can someone clarify?', 312, FALSE, 22, 2, 3),  -- Computer Science, Bob
('Linear algebra basis vectors', 'What exactly are basis vectors and how do they relate to coordinate systems?', 45, FALSE, 2, 1, 1),  -- Mathematics, John
('Web security best practices', 'What are the most important security practices for a new web application?', 198, FALSE, 18, 2, 2),  -- Computer Science, Jane
('Quantum entanglement explanation', 'Can someone explain quantum entanglement in simple terms?', 76, TRUE, 6, 3, 3),  -- Physics, Bob
('MySQL vs PostgreSQL for large applications', 'Which database system would be better for a large-scale application and why?', 123, FALSE, 9, 2, 1);  -- Computer Science, John

-- Answers (FIFTH - AFTER Questions exist)
INSERT INTO Answer (body, is_accepted, score, is_anonymous, question_id, user_id) VALUES
-- Answers for Question 1
('Use EXPLAIN to analyze your query execution plan. Look for full table scans and add appropriate indexes.', TRUE, 15, FALSE, 1, 2),
('Make sure to index columns used in WHERE clauses and JOIN conditions. Also, avoid SELECT * and only fetch needed columns.', FALSE, 8, FALSE, 1, 3),
('Consider using query caching and optimizing your database configuration settings like buffer pool size.', FALSE, 5, TRUE, 1, 4),  -- Anonymous answer

-- Answers for Question 2
('First, find the antiderivative: F(x) = x³ + x² - x. Then evaluate F(5) - F(0) = (125 + 25 - 5) - 0 = 145', TRUE, 12, FALSE, 2, 1),
('Remember that ∫(3x²)dx = x³, ∫(2x)dx = x², and ∫(-1)dx = -x. Apply the power rule for each term.', FALSE, 6, TRUE, 2, 5),  -- Anonymous answer

-- Answers for Question 3
('Make sure your app.listen() call comes after all route definitions. Also check your base path configuration.', TRUE, 18, FALSE, 3, 2),
('You might have a middleware that is not calling next(). Check your middleware order and implementation.', FALSE, 9, FALSE, 3, 4),
('Try using console.log to debug the route registration order. Sometimes the order matters.', FALSE, 4, TRUE, 3, 1),  -- Anonymous answer

-- Answers for Question 4
('Use the formula: h = v²/(2g) where v=20 m/s and g=9.8 m/s². So h = 400/(19.6) ≈ 20.41 meters', TRUE, 7, FALSE, 4, 3),
('At maximum height, final velocity is 0. Use v² = u² - 2gh to solve for h.', FALSE, 3, TRUE, 4, 5),  -- Anonymous answer

-- Answers for Question 5
('1NF: Each column atomic - no arrays/lists. 2NF: No partial dependencies. 3NF: No transitive dependencies.', TRUE, 20, FALSE, 5, 1),
('Example: Student table with multiple phone numbers violates 1NF. Split into separate rows or table.', FALSE, 11, FALSE, 5, 2),

-- Answers for Question 6
('Async/await is syntactic sugar for Promises. Use async/await for cleaner code, but understand Promises first.', TRUE, 25, FALSE, 6, 3),
('Remember: async functions always return Promises. Await can only be used inside async functions.', FALSE, 14, TRUE, 6, 4),  -- Anonymous answer

-- Answers for Question 7
('Basis vectors form a coordinate system. In 2D, i=(1,0) and j=(0,1) are standard basis vectors.', TRUE, 5, FALSE, 7, 2),
('Any vector in the space can be written as a linear combination of basis vectors.', FALSE, 2, TRUE, 7, 5),  -- Anonymous answer

-- Answers for Question 8
('Always hash passwords with salt, use HTTPS, validate input, and implement proper authentication.', TRUE, 22, FALSE, 8, 1),
('Don''t forget about CSRF protection, XSS prevention, and regular security updates.', FALSE, 15, TRUE, 8, 3),  -- Anonymous answer

-- Answers for Question 9
('Quantum entanglement is when particles become connected and affect each other instantly, even at distance.', TRUE, 9, FALSE, 9, 2),
('Einstein called it "spooky action at a distance". It challenges our classical understanding of physics.', FALSE, 4, TRUE, 9, 1),  -- Anonymous answer

-- Answers for Question 10
('PostgreSQL has better support for complex queries, JSON, and spatial data. MySQL is faster for simple reads.', TRUE, 12, FALSE, 10, 3),
('Consider your team''s expertise. Both are good choices but have different strengths.', FALSE, 6, TRUE, 10, 4);  -- Anonymous answer

-- Question-Tag relationships (SIXTH - AFTER Questions and Tags exist)
INSERT INTO QuestionTag (tag_id, question_id) VALUES
-- Question 1 tags
(2, 1), (7, 1), -- sql, database
-- Question 2 tags
(1, 2), (6, 2), -- algebra, homework-help
-- Question 3 tags
(3, 3), (4, 3), (8, 3), -- programming, nodejs, practice
-- Question 4 tags
(5, 4), (6, 4), -- mechanics, homework-help
-- Question 5 tags
(2, 5), (7, 5), -- sql, theory
-- Question 6 tags
(3, 6), (4, 6), (8, 6), -- programming, javascript, practice
-- Question 7 tags
(1, 7), (7, 7), -- algebra, theory
-- Question 8 tags
(3, 8), (7, 8), -- programming, theory
-- Question 9 tags
(5, 9), (7, 9), -- mechanics, theory
-- Question 10 tags
(2, 10), (7, 10); -- sql, theory

-- Comments on questions and answers (SEVENTH)
INSERT INTO Comment (body, user_id, question_id, answer_id) VALUES
-- Comments on questions
('Great question! I had the same issue last week.', 2, 1, NULL),
('Could you provide more details about your table structure?', 3, 1, NULL),
('This is a common problem in introductory calculus.', 1, 2, NULL),

-- Comments on answers
('This solved my problem, thank you!', 4, NULL, 1),
('What about using composite indexes?', 5, NULL, 1),
('Don''t forget the constant of integration!', 2, NULL, 4),
('Excellent explanation of the physics concept.', 1, NULL, 8),
('What about connection pooling for optimization?', 3, NULL, 3);

-- Votes on questions and answers (EIGHTH)
INSERT INTO Votes (vote_type, user_id, question_id, answer_id) VALUES
-- Question votes (using users 1-5)
('upvote', 2, 1, NULL), ('upvote', 3, 1, NULL), ('upvote', 4, 1, NULL), ('upvote', 5, 1, NULL),
('upvote', 1, 2, NULL), ('upvote', 3, 2, NULL), ('downvote', 4, 2, NULL),
('upvote', 1, 3, NULL), ('upvote', 2, 3, NULL), ('upvote', 4, 3, NULL), ('upvote', 5, 3, NULL),
('upvote', 2, 4, NULL), ('upvote', 3, 4, NULL),
('upvote', 1, 5, NULL), ('upvote', 2, 5, NULL), ('upvote', 3, 5, NULL), ('upvote', 4, 5, NULL),

-- Answer votes (using users 1-5)
('upvote', 1, NULL, 1), ('upvote', 3, NULL, 1), ('upvote', 4, NULL, 1), ('upvote', 5, NULL, 1),
('upvote', 2, NULL, 2), ('upvote', 4, NULL, 2),
('upvote', 1, NULL, 4), ('upvote', 2, NULL, 4), ('upvote', 5, NULL, 4),
('upvote', 3, NULL, 7), ('upvote', 4, NULL, 7), ('upvote', 5, NULL, 7),
('upvote', 1, NULL, 11), ('upvote', 2, NULL, 11), ('upvote', 3, NULL, 11), ('upvote', 4, NULL, 11),
('upvote', 2, NULL, 13), ('upvote', 4, NULL, 13), ('upvote', 5, NULL, 13);

COMMIT;
