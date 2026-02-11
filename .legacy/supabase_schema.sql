-- Create products table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL, -- 'figurine', 'shoe', 'cosplay'
    price DECIMAL(10, 2) NOT NULL,
    image_url TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert some initial data
INSERT INTO products (name, category, price, image_url, description) VALUES
('Geto Suguru Figure', 'figurine', 150.00, 'image/geto.png', 'Powerful Geto Suguru figure'),
('Nekoma Kenma Custom Shoes', 'shoe', 99.99, 'image/kenma.jpg', 'Haikyuu inspired Nekoma shoes'),
('Itadori Yuji Custom Shoes', 'shoe', 80.00, 'image/yuji.jpg', 'Jujutsu Kaisen inspired Yuji shoes'),
('Monkey D. Luffy Custom Shoes', 'shoe', 111.00, 'image/luffy.jpg', 'One Piece inspired Luffy shoes'),
('Osamu Dazai Custom Shoes', 'shoe', 102.50, 'image/dazai.jpg', 'Bungo Stray Dogs inspired Dazai shoes'),
('Satoru Gojo Custom Shoes', 'shoe', 150.00, 'image/gojo.jpg', 'Jujutsu Kaisen inspired Gojo shoes'),
('Nakahara Chuya Custom Shoes', 'shoe', 150.00, 'image/chuya.jpg', 'Bungo Stray Dogs inspired Chuya shoes'),
('Kyojuro Rengoku Cosplay costume', 'cosplay', 220.00, 'image/rengoku.jpg', 'Demon Slayer Rengoku costume'),
('Roronoa Zoro Cosplay Costume', 'cosplay', 219.00, 'image/zoro.jpg', 'One Piece Zoro costume'),
('Fushiguro Toji Cosplay Costume', 'cosplay', 140.00, 'image/toji.jpg', 'Jujutsu Kaisen Toji costume'),
('Manjiro "Mikey" Sano Cosplay Costume', 'cosplay', 185.00, 'image/mikey.jpg', 'Tokyo Revengers Mikey costume'),
('Kanao Cosplay Costume', 'cosplay', 225.50, 'image/kanao.jpg', 'Demon Slayer Kanao costume'),
('Kamado Nezuko Cosplay Costume', 'cosplay', 230.00, 'image/nezuko.jpg', 'Demon Slayer Nezuko costume');

-- Create contact_submissions table
CREATE TABLE contact_submissions (
    id SERIAL PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security (optional but recommended)
-- For simplicity in this demo, you can disable RLS or add policies to allow public read/write
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read-only access" ON products FOR SELECT USING (true);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert access" ON contact_submissions FOR INSERT WITH CHECK (true);
