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

-- Insert sample data
INSERT INTO User (first_name, last_name, password, salt, email) VALUES
('John', 'Doe', 'hashed_password_1', 'salt1', 'john.doe@email.com'),
('Jane', 'Smith', 'hashed_password_2', 'salt2', 'jane.smith@email.com'),
('Bob', 'Johnson', 'hashed_password_3', 'salt3', 'bob.johnson@email.com');

INSERT INTO Course (name, code) VALUES
('Mathematics', 'MATH101'),
('Computer Science', 'CS201'),
('Physics', 'PHY301');

INSERT INTO Tag (name) VALUES
('algebra'),
('calculus'),
('programming'),
('java'),
('mechanics'),
('homework');

COMMIT;

-- Create user if it doesn't exist
CREATE USER IF NOT EXISTS 'myuser'@'%' IDENTIFIED BY 'supersecretpassword';

-- Grant all privileges on your database
GRANT ALL PRIVILEGES ON mydatabase.* TO 'myuser'@'%';

-- Apply privileges
FLUSH PRIVILEGES;

