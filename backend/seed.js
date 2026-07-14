const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const User = require('./models/User');
const Seller = require('./models/Seller');
const Admin = require('./models/Admin');
const Book = require('./models/Book');
const Order = require('./models/Order');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/bookstore';

const bookData = {
  Fiction: [
    { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', description: 'A classic story of wealth, love, and the American Dream in Long Island.', price: 299, originalPrice: 399, pages: 180, isbn: '9780743273565' },
    { title: 'To Kill a Mockingbird', author: 'Harper Lee', description: 'A gripping exploration of race and class in the Deep South.', price: 349, originalPrice: 499, pages: 281, isbn: '9780061120084' },
    { title: 'The Alchemist', author: 'Paulo Coelho', description: 'The magical story of Santiago, a shepherd boy searching for treasure.', price: 199, originalPrice: 299, pages: 163, isbn: '9780061122415' },
    { title: '1984', author: 'George Orwell', description: 'A dystopian vision of a totalitarian regime dominating human life.', price: 249, originalPrice: 349, pages: 328, isbn: '9780451524935' },
    { title: 'The Catcher in the Rye', author: 'Holden Caulfield', description: 'The experiences of teenager Holden Caulfield in New York City.', price: 280, originalPrice: 380, pages: 224, isbn: '9780316769174' },
    { title: 'Brave New World', author: 'Aldous Huxley', description: 'A prophetic novel detailing a futuristic society obsessed with technology and stability.', price: 320, originalPrice: 450, pages: 268, isbn: '9780060850524' },
    { title: 'Lord of the Flies', author: 'William Golding', description: 'A classic tale of a group of schoolboys stranded on a deserted island.', price: 220, originalPrice: 299, pages: 224, isbn: '9780399501487' },
    { title: 'The Book Thief', author: 'Markus Zusak', description: 'A story of a young girl living in Germany during World War II, narrated by Death.', price: 399, originalPrice: 499, pages: 552, isbn: '9780375831003' },
    { title: 'Animal Farm', author: 'George Orwell', description: 'A satirical allegorical novella reflecting events leading up to the Russian Revolution.', price: 180, originalPrice: 250, pages: 112, isbn: '9780451526342' },
    { title: 'Life of Pi', author: 'Yann Martel', description: 'The magical story of a boy surviving on a lifeboat in the company of a Bengal tiger.', price: 279, originalPrice: 399, pages: 319, isbn: '9780156027328' }
  ],
  'Non-Fiction': [
    { title: 'Sapiens: A Brief History of Humankind', author: 'Yuval Noah Harari', description: 'An exploration of human history and evolution from the Stone Age onwards.', price: 499, originalPrice: 599, pages: 443, isbn: '9780062316097' },
    { title: 'Educated', author: 'Tara Westover', description: 'A memoir about a young girl who leaves her survivalist family in Idaho to pursue education.', price: 399, originalPrice: 499, pages: 352, isbn: '9780399590504' },
    { title: 'Becoming', author: 'Michelle Obama', description: 'An intimate, powerful memoir by the former First Lady of the United States.', price: 450, originalPrice: 599, pages: 448, isbn: '9781524763138' },
    { title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', description: 'An analysis of the two systems that drive the way we think.', price: 420, originalPrice: 550, pages: 499, isbn: '9780374275631' },
    { title: 'The Emperor of All Maladies', author: 'Siddhartha Mukherjee', description: 'A magnificent biography of cancer, tracking its origin and modern cure.', price: 599, originalPrice: 799, pages: 573, isbn: '9781439170915' },
    { title: 'Quiet: The Power of Introverts', author: 'Susan Cain', description: 'An investigation into how the modern world undervalues introverted personalities.', price: 350, originalPrice: 450, pages: 368, isbn: '9780307352156' },
    { title: 'The Immortal Life of Henrietta Lacks', author: 'Rebecca Skloot', description: 'The fascinating story of HeLa cells and their impact on medical history.', price: 299, originalPrice: 399, pages: 381, isbn: '9781400052189' },
    { title: 'Freakonomics', author: 'Steven D. Levitt', description: 'A rogue economist explores the hidden side of everything.', price: 279, originalPrice: 379, pages: 336, isbn: '9780060731335' },
    { title: 'Outliers: The Story of Success', author: 'Malcolm Gladwell', description: 'An examination of why some people achieve extraordinary things.', price: 349, originalPrice: 450, pages: 309, isbn: '9780316017923' },
    { title: 'Into the Wild', author: 'Jon Krakauer', description: 'The tragic true story of Christopher McCandless\'s journey into the Alaskan wilderness.', price: 250, originalPrice: 350, pages: 207, isbn: '9780385486804' }
  ],
  Science: [
    { title: 'A Brief History of Time', author: 'Stephen Hawking', description: 'A classic introduction to cosmology, space, and the origins of our universe.', price: 399, originalPrice: 499, pages: 212, isbn: '9780553380163' },
    { title: 'Cosmos', author: 'Carl Sagan', description: 'A magnificent journey through space, time, and human scientific achievement.', price: 349, originalPrice: 450, pages: 365, isbn: '9780345331359' },
    { title: 'The Selfish Gene', author: 'Richard Dawkins', description: 'A classic work of evolutionary biology explaining how genes drive behavior.', price: 420, originalPrice: 550, pages: 360, isbn: '9780199291151' },
    { title: 'Astrophysics for People in a Hurry', author: 'Neil deGrasse Tyson', description: 'A quick, witty summary of modern cosmic principles.', price: 299, originalPrice: 399, pages: 224, isbn: '9780393609394' },
    { title: 'The Elegant Universe', author: 'Brian Greene', description: 'An explanation of superstrings, hidden dimensions, and the quest for the ultimate theory.', price: 450, originalPrice: 599, pages: 448, isbn: '9780393338102' },
    { title: 'What If?', author: 'Randall Munroe', description: 'Serious scientific answers to absurd hypothetical questions from the creator of xkcd.', price: 399, originalPrice: 499, pages: 304, isbn: '9780544272996' },
    { title: 'Silent Spring', author: 'Rachel Carson', description: 'The landmark book that started the global environmental movement.', price: 250, originalPrice: 350, pages: 368, isbn: '9780618249060' },
    { title: 'The Gene: An Intimate History', author: 'Siddhartha Mukherjee', description: 'A fascinating story of genetics, mapping the human blueprint.', price: 550, originalPrice: 699, pages: 608, isbn: '9781476733500' },
    { title: 'The Demon-Haunted World', author: 'Carl Sagan', description: 'Science as a candle in the dark, defending critical thinking against pseudoscience.', price: 379, originalPrice: 499, pages: 480, isbn: '9780345409461' },
    { title: 'The Double Helix', author: 'James D. Watson', description: 'A personal account of the discovery of the structure of DNA.', price: 220, originalPrice: 299, pages: 256, isbn: '9780743216302' }
  ],
  Romance: [
    { title: 'Pride and Prejudice', author: 'Jane Austen', description: 'The sparkling romantic story of Elizabeth Bennet and Mr. Darcy.', price: 199, originalPrice: 299, pages: 279, isbn: '9780141439518' },
    { title: 'The Notebook', author: 'Nicholas Sparks', description: 'A tragic, enduring love story of Noah and Allie, spanning decades.', price: 250, originalPrice: 350, pages: 214, isbn: '9780446605236' },
    { title: 'The Fault in Our Stars', author: 'John Green', description: 'The romantic and heart-wrenching journey of Hazel and Augustus.', price: 299, originalPrice: 399, pages: 313, isbn: '9780525478812' },
    { title: 'Me Before You', author: 'Jojo Moyes', description: 'A deeply moving story about two people who have nothing in common, until a tragedy brings them together.', price: 280, originalPrice: 380, pages: 369, isbn: '9780143124542' },
    { title: 'Sense and Sensibility', author: 'Jane Austen', description: 'The romantic trials of sisters Elinor and Marianne Dashwood.', price: 199, originalPrice: 299, pages: 409, isbn: '9780141439662' },
    { title: 'Outlander', author: 'Diana Gabaldon', description: 'A time-travel romance setting a 20th-century nurse in 18th-century Scotland.', price: 399, originalPrice: 550, pages: 850, isbn: '9780440212560' },
    { title: 'Jane Eyre', author: 'Charlotte Brontë', description: 'An orphan girl rises to become a governess and falls in love with the brooding Mr. Rochester.', price: 220, originalPrice: 320, pages: 507, isbn: '9780141441146' },
    { title: 'Wuthering Heights', author: 'Emily Brontë', description: 'The stormy, destructive love between Heathcliff and Catherine Earnshaw.', price: 210, originalPrice: 299, pages: 416, isbn: '9780141439556' },
    { title: 'Twilight', author: 'Stephenie Meyer', description: 'A high school girl falls in love with a vampire in the small town of Forks.', price: 349, originalPrice: 499, pages: 498, isbn: '9780316160179' },
    { title: 'Red, White & Royal Blue', author: 'Casey McQuiston', description: 'The rival relationship between the First Son of America and a Prince of Wales turns romantic.', price: 320, originalPrice: 420, pages: 423, isbn: '9781250316776' }
  ],
  Mystery: [
    { title: 'The Silent Patient', author: 'Alex Michaelides', description: 'Alicia Berenson shot her husband and has not spoken a word since.', price: 279, originalPrice: 349, pages: 336, isbn: '9781250301697' },
    { title: 'Sherlock Holmes Novels', author: 'Arthur Conan Doyle', description: 'A collection of the greatest detective novels in history.', price: 499, originalPrice: 650, pages: 800, isbn: '9781607102113' },
    { title: 'Gone Girl', author: 'Gillian Flynn', description: 'The mysterious disappearance of Amy Dunne on her wedding anniversary.', price: 249, originalPrice: 399, pages: 422, isbn: '9780307588371' },
    { title: 'And Then There Were None', author: 'Agatha Christie', description: 'Ten strangers are lured to an island, where they are killed one by one.', price: 299, originalPrice: 399, pages: 272, isbn: '9780062073488' },
    { title: 'The Girl with the Dragon Tattoo', author: 'Stieg Larsson', description: 'A complex mystery involving corporate greed and family secrets in Sweden.', price: 349, originalPrice: 499, pages: 465, isbn: '9780307949486' },
    { title: 'Big Little Lies', author: 'Liane Moriarty', description: 'A murder mystery set among mothers in an affluent Australian suburb.', price: 280, originalPrice: 380, pages: 460, isbn: '9780399167065' },
    { title: 'The Da Vinci Code', author: 'Dan Brown', description: 'A thrilling chase through Europe to unlock a secret hidden by Leonardo da Vinci.', price: 399, originalPrice: 499, pages: 489, isbn: '9780307474278' },
    { title: 'Sharp Objects', author: 'Gillian Flynn', description: 'A reporter returns to her hometown to investigate the murders of two young girls.', price: 230, originalPrice: 330, pages: 254, isbn: '9780307341556' },
    { title: 'The Guest List', author: 'Lucy Foley', description: 'A luxury wedding on an isolated Irish island turns deadly as guests harbor old grudges.', price: 290, originalPrice: 390, pages: 313, isbn: '9780062868824' },
    { title: 'In Cold Blood', author: 'Truman Capote', description: 'The chilling true story of the murder of the Clutter family in Kansas.', price: 350, originalPrice: 450, pages: 343, isbn: '9780679745587' }
  ],
  Thriller: [
    { title: 'The Girl on the Train', author: 'Paula Hawkins', description: 'Rachel observes a perfect couple from the train window until she witnesses something shocking.', price: 260, originalPrice: 360, pages: 323, isbn: '9781594634024' },
    { title: 'Angels & Demons', author: 'Dan Brown', description: 'A thrilling race against time to save Rome from an ancient secret society.', price: 399, originalPrice: 499, pages: 572, isbn: '9780743493467' },
    { title: 'Shutter Island', author: 'Dennis Lehane', description: 'A U.S. Marshal investigates the escape of a patient from an asylum on a remote island.', price: 279, originalPrice: 379, pages: 369, isbn: '9780062201393' },
    { title: 'Misery', author: 'Stephen King', description: 'An author is captured and held hostage by his number one fan.', price: 299, originalPrice: 399, pages: 370, isbn: '9781501143106' },
    { title: 'The Shining', author: 'Stephen King', description: 'A family moves into an isolated hotel for the winter, where spirits slowly drive the father insane.', price: 349, originalPrice: 499, pages: 447, isbn: '9780307743657' },
    { title: 'The Silence of the Lambs', author: 'Thomas Harris', description: 'An FBI trainee must interview a psychopathic psychiatrist to catch a serial killer.', price: 289, originalPrice: 389, pages: 368, isbn: '9780312924584' },
    { title: 'Bird Box', author: 'Josh Malerman', description: 'A woman and two children make their way down a river blindfolded in a post-apocalyptic world.', price: 250, originalPrice: 350, pages: 262, isbn: '9780062259653' },
    { title: 'You', author: 'Caroline Kepnes', description: 'A bookstore manager develops a dangerous obsession with a customer.', price: 280, originalPrice: 380, pages: 422, isbn: '9781476785608' },
    { title: 'The Reversal', author: 'Michael Connelly', description: 'Defense attorney Mickey Haller takes on a high-stakes case as a special prosecutor.', price: 310, originalPrice: 410, pages: 418, isbn: '9780446545938' },
    { title: 'The Bourne Identity', author: 'Robert Ludlum', description: 'An amnesiac man discovers he is a highly trained government assassin.', price: 320, originalPrice: 420, pages: 566, isbn: '9780553260113' }
  ],
  Biography: [
    { title: 'Steve Jobs', author: 'Walter Isaacson', description: 'The comprehensive biography of Apple\'s visionary co-founder.', price: 599, originalPrice: 799, pages: 656, isbn: '9781451648539' },
    { title: 'Elon Musk', author: 'Walter Isaacson', description: 'An inside account of the life of the controversial billionaire entrepreneur.', price: 650, originalPrice: 850, pages: 688, isbn: '9781982181284' },
    { title: 'The Diary of a Young Girl', author: 'Anne Frank', description: 'The writings of a teenage Jewish girl in hiding in Amsterdam during the Holocaust.', price: 150, originalPrice: 199, pages: 283, isbn: '9780553296983' },
    { title: 'Long Walk to Freedom', author: 'Nelson Mandela', description: 'The inspiring autobiography of the South African anti-apartheid leader.', price: 499, originalPrice: 650, pages: 656, isbn: '9780316548182' },
    { title: 'Shoe Dog', author: 'Phil Knight', description: 'A memoir by the creator of Nike, detailing the brand\'s early days.', price: 399, originalPrice: 499, pages: 399, isbn: '9781501135927' },
    { title: 'Alexander Hamilton', author: 'Ron Chernow', description: 'The classic biography that inspired the hit Broadway musical.', price: 550, originalPrice: 750, pages: 818, isbn: '9780143034759' },
    { title: 'Total Recall', author: 'Arnold Schwarzenegger', description: 'The remarkable autobiography of a bodybuilder, actor, and politician.', price: 450, originalPrice: 599, pages: 656, isbn: '9781451662436' },
    { title: 'I Know Why the Caged Bird Sings', author: 'Maya Angelou', description: 'A poetic autobiography describing growing up in the American South.', price: 299, originalPrice: 399, pages: 289, isbn: '9780345514400' },
    { title: 'Open: An Autobiography', author: 'Andre Agassi', description: 'A raw, honest autobiography of one of the greatest tennis champions.', price: 380, originalPrice: 480, pages: 388, isbn: '9780307388407' },
    { title: 'Frida', author: 'Hayden Herrera', description: 'The biography of legendary Mexican painter Frida Kahlo.', price: 499, originalPrice: 650, pages: 528, isbn: '9780060085896' }
  ],
  Children: [
    { title: 'Charlotte\'s Web', author: 'E. B. White', description: 'A classic story of friendship between Wilbur the pig and Charlotte the spider.', price: 180, originalPrice: 249, pages: 192, isbn: '9780064400558' },
    { title: 'Harry Potter & Sorcerer\'s Stone', author: 'J. K. Rowling', description: 'A young boy discovers he is a wizard and attends Hogwarts.', price: 399, originalPrice: 499, pages: 309, isbn: '9780590353427' },
    { title: 'The Little Prince', author: 'Antoine de Saint-Exupéry', description: 'A magical story of a young pilot meeting a prince from an asteroid.', price: 150, originalPrice: 199, pages: 96, isbn: '9780156012195' },
    { title: 'Where the Wild Things Are', author: 'Maurice Sendak', description: 'A young boy travels to an island populated by friendly wild monsters.', price: 220, originalPrice: 299, pages: 48, isbn: '9780060254902' },
    { title: 'Alice in Wonderland', author: 'Lewis Carroll', description: 'Alice falls down a rabbit hole into a logical fantasy world.', price: 199, originalPrice: 299, pages: 192, isbn: '9780141439495' },
    { title: 'Matilda', author: 'Roald Dahl', description: 'A highly intelligent young girl discovers she has telekinetic powers.', price: 250, originalPrice: 350, pages: 232, isbn: '9780142410370' },
    { title: 'Green Eggs and Ham', author: 'Dr. Seuss', description: 'Sam-I-Am tries to convince a friend to try a green dish in various places.', price: 140, originalPrice: 180, pages: 62, isbn: '9780394800165' },
    { title: 'The Giving Tree', author: 'Shel Silverstein', description: 'A touching story of a lifelong relationship between a boy and an apple tree.', price: 220, originalPrice: 299, pages: 64, isbn: '9780060256654' },
    { title: 'Winnie-the-Pooh', author: 'A. A. Milne', description: 'The adventures of a honey-loving bear and his friends in the Hundred Acre Wood.', price: 199, originalPrice: 260, pages: 160, isbn: '9780140361216' },
    { title: 'Charlie & the Chocolate Factory', author: 'Roald Dahl', description: 'Five lucky children win a tour of Willy Wonka\'s mysterious chocolate factory.', price: 250, originalPrice: 320, pages: 192, isbn: '9780142410318' }
  ],
  Fantasy: [
    { title: 'The Hobbit', author: 'J. R. R. Tolkien', description: 'Bilbo Baggins is swept into a quest to reclaim a mountain from a dragon.', price: 399, originalPrice: 499, pages: 310, isbn: '9780261102217' },
    { title: 'The Fellowship of the Ring', author: 'J. R. R. Tolkien', description: 'Frodo Baggins sets off from the Shire with a quest to destroy the One Ring.', price: 450, originalPrice: 599, pages: 423, isbn: '9780261102354' },
    { title: 'A Game of Thrones', author: 'George R. R. Martin', description: 'The opening volume of a dark epic saga detailing dynastic struggles.', price: 499, originalPrice: 650, pages: 835, isbn: '9780553103540' },
    { title: 'The Way of Kings', author: 'Brandon Sanderson', description: 'A massive high fantasy detailing an ancient war on a storm-swept world.', price: 599, originalPrice: 799, pages: 1007, isbn: '9780765326355' },
    { title: 'The Lightning Thief', author: 'Rick Riordan', description: 'A modern boy discovers he is the son of the Greek god Poseidon.', price: 299, originalPrice: 399, pages: 377, isbn: '9780786856299' },
    { title: 'The Name of the Wind', author: 'Patrick Rothfuss', description: 'The autobiography of a legendary magician and musician.', price: 399, originalPrice: 499, pages: 662, isbn: '9780756404741' },
    { title: 'The Chronicles of Narnia', author: 'C. S. Lewis', description: 'A gateway in a wardrobe leads four children into a magical frozen land.', price: 499, originalPrice: 699, pages: 767, isbn: '9780066238500' },
    { title: 'Mistborn: The Final Empire', author: 'Brandon Sanderson', description: 'A crew of thieves attempts to overthrow a dark immortal emperor.', price: 380, originalPrice: 480, pages: 541, isbn: '9780765311788' },
    { title: 'American Gods', author: 'Neil Gaiman', description: 'A struggle between old mythological gods and new modern corporate deities.', price: 320, originalPrice: 450, pages: 465, isbn: '9780380973651' },
    { title: 'Good Omens', author: 'Neil Gaiman & Terry Pratchett', description: 'An angel and a demon team up to prevent the coming of the Apocalypse.', price: 299, originalPrice: 399, pages: 432, isbn: '9780060853969' }
  ],
  History: [
    { title: 'SPQR: History of Ancient Rome', author: 'Mary Beard', description: 'An analytical and vibrant history of the Roman Republic and Empire.', price: 549, originalPrice: 699, pages: 608, isbn: '9781846683800' },
    { title: 'Guns, Germs, and Steel', author: 'Jared Diamond', description: 'How environmental factors shaped modern human history and civilizations.', price: 450, originalPrice: 599, pages: 480, isbn: '9780393061314' },
    { title: 'The Guns of August', author: 'Barbara W. Tuchman', description: 'The classic narrative of the outbreak and first month of World War I.', price: 399, originalPrice: 499, pages: 511, isbn: '9780345386236' },
    { title: 'Team of Rivals', author: 'Doris Kearns Goodwin', description: 'The political genius of Abraham Lincoln and his cabinet.', price: 499, originalPrice: 650, pages: 944, isbn: '9780743270755' },
    { title: 'Band of Brothers', author: 'Stephen E. Ambrose', description: 'The legendary story of Easy Company, 506th Regiment during WWII.', price: 299, originalPrice: 399, pages: 336, isbn: '9780743224543' },
    { title: 'Rise and Fall of the Third Reich', author: 'William L. Shirer', description: 'A massive, definitive history of Nazi Germany.', price: 690, originalPrice: 899, pages: 1249, isbn: '9781451651683' },
    { title: 'People\'s History of the United States', author: 'Howard Zinn', description: 'America\'s history told from the perspective of marginalized classes.', price: 420, originalPrice: 550, pages: 729, isbn: '9780060838652' },
    { title: 'Postwar: Europe Since 1945', author: 'Tony Judt', description: 'A comprehensive history of Europe following the end of WWII.', price: 599, originalPrice: 799, pages: 960, isbn: '9781594200656' },
    { title: 'Genghis Khan and Modern World', author: 'Jack Weatherford', description: 'How the Mongol conqueror reshaped global systems, trade, and culture.', price: 280, originalPrice: 380, pages: 352, isbn: '9780609809648' },
    { title: '1776', author: 'David McCullough', description: 'The story of the American Revolutionary forces during the critical year 1776.', price: 350, originalPrice: 450, pages: 386, isbn: '9780743226714' }
  ],
  'Self-Help': [
    { title: 'Atomic Habits', author: 'James Clear', description: 'An easy and proven way to build good habits and break bad ones.', price: 360, originalPrice: 499, pages: 320, isbn: '9780735211292' },
    { title: '7 Habits of Highly Effective People', author: 'Stephen R. Covey', description: 'A principal-centered approach for solving personal and professional problems.', price: 399, originalPrice: 550, pages: 381, isbn: '9780743269513' },
    { title: 'How to Win Friends & Influence People', author: 'Dale Carnegie', description: 'The classic handbook on communication and relationship building.', price: 180, originalPrice: 250, pages: 288, isbn: '9780671027032' },
    { title: 'The Power of Now', author: 'Eckhart Tolle', description: 'A guide to spiritual enlightenment through living in the present moment.', price: 299, originalPrice: 399, pages: 236, isbn: '9781577314806' },
    { title: 'Think and Grow Rich', author: 'Napoleon Hill', description: 'The original guide to personal wealth creation and mind power.', price: 150, originalPrice: 199, pages: 238, isbn: '9781593302009' },
    { title: 'Daring Greatly', author: 'Brené Brown', description: 'How the courage to be vulnerable transforms the way we live, love, parent, and lead.', price: 320, originalPrice: 450, pages: 287, isbn: '9781592408412' },
    { title: 'Make Your Bed', author: 'William H. McRaven', description: 'Little things that can change your life and maybe the world, from a Navy SEAL.', price: 199, originalPrice: 299, pages: 125, isbn: '9781478966661' },
    { title: 'You Are a Badass', author: 'Jen Sincero', description: 'How to stop doubting your greatness and start living an awesome life.', price: 280, originalPrice: 380, pages: 256, isbn: '9780762447695' },
    { title: 'Subtle Art of Not Giving a F*ck', author: 'Mark Manson', description: 'A counterintuitive approach to living a good, realistic life.', price: 350, originalPrice: 450, pages: 224, isbn: '9780062457714' },
    { title: 'Can\'t Hurt Me', author: 'David Goggins', description: 'Master your mind and defy the odds with the story of an elite warrior.', price: 399, originalPrice: 550, pages: 360, isbn: '9781544512280' }
  ],
  Technology: [
    { title: 'Clean Code', author: 'Robert C. Martin', description: 'A handbook of agile software craftsmanship, filled with clean code principles.', price: 650, originalPrice: 899, pages: 464, isbn: '9780132350884' },
    { title: 'The Pragmatic Programmer', author: 'Andrew Hunt & David Thomas', description: 'A guide to programming craft and career development.', price: 580, originalPrice: 750, pages: 352, isbn: '9780201616224' },
    { title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', description: 'The absolute standard textbook covering all modern algorithms.', price: 999, originalPrice: 1499, pages: 1312, isbn: '9780262033848' },
    { title: 'Design Patterns', author: 'Erich Gamma', description: 'Catalog of reusable object-oriented software design patterns.', price: 699, originalPrice: 950, pages: 395, isbn: '9780201633610' },
    { title: 'Code Complete', author: 'Steve McConnell', description: 'A practical handbook of software construction and craftsmanship.', price: 699, originalPrice: 999, pages: 960, isbn: '9780735619678' },
    { title: 'Structure & Interpretation of Programs', author: 'Harold Abelson', description: 'The classic computer science textbook teaching abstraction and modularity.', price: 850, originalPrice: 1200, pages: 657, isbn: '9780262510875' },
    { title: 'Refactoring', author: 'Martin Fowler', description: 'Improving the design of existing code bases safely and systematically.', price: 599, originalPrice: 850, pages: 448, isbn: '9780201485677' },
    { title: 'Cracking the Coding Interview', author: 'Gayle Laakmann McDowell', description: '189 programming questions and solutions for technical job interviews.', price: 499, originalPrice: 699, pages: 687, isbn: '9780984782857' },
    { title: 'Continuous Delivery', author: 'Jez Humble & David Farley', description: 'Reliable software releases through build, test, and deployment automation.', price: 620, originalPrice: 850, pages: 496, isbn: '9780321601919' },
    { title: 'Clean Architecture', author: 'Robert C. Martin', description: 'A craftsman\'s guide to software structure and design rules.', price: 599, originalPrice: 799, pages: 432, isbn: '9780134494166' }
  ]
};

const genreImages = {
  Fiction: [
    'photo-1544947950-fa07a98d237f', 'photo-1543002588-bfa74002ed7e',
    'photo-1532012197267-da84d127e765', 'photo-1476275466078-4007374efbbe',
    'photo-1512820790803-83ca734da794', 'photo-1516979187457-637abb4f9353',
    'photo-1495446815901-a7297e633e8d', 'photo-1506880018603-83d5b814b5a6',
    'photo-1524995997946-a1c2e315a42f', 'photo-1589829085413-56de8ae18c73'
  ],
  'Non-Fiction': [
    'photo-1509021436665-8f07dbf5bf1d', 'photo-1457369804613-52c61a468e7d',
    'photo-1463320352785-249000eed5b8', 'photo-1481627834876-b7833e8f5570',
    'photo-1506880018603-83d5b814b5a6', 'photo-1513001900722-370f803f498d',
    'photo-1516979187457-637abb4f9353', 'photo-1550399105-c4dbb677a11b',
    'photo-1508921912186-1d1a45ebb3c1', 'photo-1521587760476-6c12a4b040da'
  ],
  Science: [
    'photo-1507668077129-56e32842fceb', 'photo-1532094349884-543bc11b234d',
    'photo-1532187863486-abf9d39d66e8', 'photo-1451187580459-43490279c0fa',
    'photo-1506645292803-579c17d4ba6a', 'photo-1614064641938-3bbee52942c7',
    'photo-1530210124550-912dc1381cb8', 'photo-1516321318423-f06f85e504b3',
    'photo-1507413245164-6160d8298b31', 'photo-1446776811953-b23d57bd21aa'
  ],
  Romance: [
    'photo-1518199266791-5375a83190b7', 'photo-1518895949257-7621c3c786d7',
    'photo-1494790108377-be9c29b29330', 'photo-1516589178581-6cd7833ae3b2',
    'photo-1501901657958-f9ff967b582b', 'photo-1490578474895-6b9ec9f2d6db',
    'photo-1518531933037-91b2f5f229cc', 'photo-1516450360452-9312f5e86fc7',
    'photo-1529156069898-49953e39b3ac', 'photo-1513272972173-511d11796a3c'
  ],
  Mystery: [
    'photo-1509248961158-e54f6934749c', 'photo-1518005020951-eccb494ad742',
    'photo-1478760329108-5c3ed9d495a0', 'photo-1505686994434-e3cc5abf1330',
    'photo-1536566482680-fca31930a0bd', 'photo-1519681393784-d120267933ba',
    'photo-1542224566-6e85f2e6772f', 'photo-1502082553048-f009c37129b9',
    'photo-1509198397868-475647b2a1e5', 'photo-1507608869274-d3177c8bb4c7'
  ],
  Thriller: [
    'photo-1509248961158-e54f6934749c', 'photo-1519074002996-a69e7ac46a42',
    'photo-1504198453319-5ce911bafcde', 'photo-1536566482680-fca31930a0bd',
    'photo-1518005020951-eccb494ad742', 'photo-1485846234645-a62644f84728',
    'photo-1509198397868-475647b2a1e5', 'photo-1500076656116-55d224f46a0b',
    'photo-1535083783855-76ae62b2914e', 'photo-1509869175650-a1d979e25595'
  ],
  Biography: [
    'photo-1534528741775-53994a69daeb', 'photo-1507003211169-0a1dd7228f2d',
    'photo-1500648767791-00dcc994a43e', 'photo-1438761681033-6461ffad8d80',
    'photo-1506794778202-cad84cf45f1d', 'photo-1544005313-94ddf0286df2',
    'photo-1519085360753-af0119f7cbe7', 'photo-1522075469751-3a6694fb2f61',
    'photo-1580489944761-15a19d654956', 'photo-1504257400762-95995282c03c'
  ],
  Children: [
    'photo-1485546246426-74dc88dec4d9', 'photo-1503919545889-aef636e10ad4',
    'photo-1515488042361-404e9250afef', 'photo-1513151233558-d860c5398176',
    'photo-1510172951991-856a654063f9', 'photo-1471286174890-9c112ffca5b4',
    'photo-1502086223501-7ea6ecd79368', 'photo-1489710437720-ebb67ec84dd2',
    'photo-1596461404969-9ae70f2830c1', 'photo-1516627145497-ae6968895b74'
  ],
  Fantasy: [
    'photo-1518709268805-4e9042af9f23', 'photo-1500964757637-c85e8a162699',
    'photo-1519074002996-a69e7ac46a42', 'photo-1518005020951-eccb494ad742',
    'photo-1461360370896-922624d12aa1', 'photo-1514894780887-121968d00567',
    'photo-1519681393784-d120267933ba', 'photo-1534447677768-be436bb09401',
    'photo-1509198397868-475647b2a1e5', 'photo-1505832018828-5a7000d7f574'
  ],
  History: [
    'photo-1447069387593-a5de0862481e', 'photo-1507842217343-583bb7270b66',
    'photo-1524995997946-a1c2e315a42f', 'photo-1568605117036-5fe5e7bab0b7',
    'photo-1505664194779-8bebcb95c02e', 'photo-1505686994434-e3cc5abf1330',
    'photo-1526304640581-d334cdbbf45e', 'photo-1461360370896-922624d12aa1',
    'photo-1544947950-fa07a98d237f', 'photo-1508921912186-1d1a45ebb3c1'
  ],
  'Self-Help': [
    'photo-1506126613408-eca07ce68773', 'photo-1515378791036-0648a3ef77b2',
    'photo-1490730141103-6cac27aaab94', 'photo-1484417894907-623942c8ea26',
    'photo-1522202176988-66273c2fd55f', 'photo-1523240795612-9a054b0db644',
    'photo-1506126613408-eca07ce68773', 'photo-1512820790803-83ca734da794',
    'photo-1527689368864-3a821dbccc34', 'photo-1499209974431-9dddcece7f88'
  ],
  Technology: [
    'photo-1518770660439-4636190af475', 'photo-1526374965328-7f61d4dc18c5',
    'photo-1531297484001-80022131f5a1', 'photo-1504639725590-34d0984388bd',
    'photo-1488590528505-98d2b5aba04b', 'photo-1550751827-4bd374c3f58b',
    'photo-1519389950473-47ba0277781c', 'photo-1517694712202-14dd9538aa97',
    'photo-1498050108023-c5249f4df085', 'photo-1525373612132-b3e2779a7c13'
  ]
};

const seedDatabase = async () => {
  try {
    console.log('🔄 Connecting to MongoDB at:', MONGO_URI);
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to database. Seeding extensive book list...');

    // Clear existing books only, keep default users & admins
    await Book.deleteMany({});
    console.log('🧹 Cleared existing books catalogue.');

    // Fetch existing sellers
    let seller1 = await Seller.findOne({ email: 'kishore@books.com' });
    let seller2 = await Seller.findOne({ email: 'bandhavi@books.com' });

    // Recreate if missing
    const sellerPassword = await bcrypt.hash('seller123', 12);
    if (!seller1) {
      seller1 = await Seller.create({
        name: 'Kishore Kumar', email: 'kishore@books.com', password: sellerPassword,
        storeName: 'Kishore Book House', phone: '9876543211', address: 'Madhapur, Hyderabad', approved: true, role: 'seller'
      });
    }
    if (!seller2) {
      seller2 = await Seller.create({
        name: 'Bandhavi Dev', email: 'bandhavi@books.com', password: sellerPassword,
        storeName: 'Bandhavi Publishers', phone: '9876543212', address: 'Gachibowli, Hyderabad', approved: true, role: 'seller'
      });
    }

    const booksToInsert = [];

    // Loop through all genres and create 10 books each
    Object.entries(bookData).forEach(([genre, books]) => {
      books.forEach((b, index) => {
        // Distribute books between the two sellers
        const selectedSeller = index % 2 === 0 ? seller1 : seller2;
        
        // Mark first two in each category as featured
        const isFeatured = index < 2;

        // Assign rating and reviews count randomly for aesthetics
        const rating = parseFloat((4.0 + Math.random() * 1.0).toFixed(1));
        const numReviews = Math.floor(5 + Math.random() * 40);

        // Get unique Unsplash image for each book
        const imgId = genreImages[genre][index % 10];
        const imageUrl = `https://images.unsplash.com/${imgId}?auto=format&fit=crop&w=400&q=80`;

        booksToInsert.push({
          ...b,
          genre,
          stock: Math.floor(5 + Math.random() * 40),
          image: imageUrl,
          featured: isFeatured,
          seller: selectedSeller._id,
          sellerName: selectedSeller.storeName,
          rating,
          numReviews,
          language: 'English',
          publisher: b.publisher || 'Global Book Press',
          publishedYear: b.publishedYear || (2000 + Math.floor(Math.random() * 24))
        });
      });
    });

    await Book.insertMany(booksToInsert);
    console.log(`✅ Seeded ${booksToInsert.length} books successfully! (10 books per genre section with cover images)`);

    // Fetch or create user for order seeding
    let orderUser = await User.findOne({ email: 'user@bookstore.com' });
    if (!orderUser) {
      const userPassword = await bcrypt.hash('user123', 12);
      orderUser = await User.create({
        name: 'Chitti Reader', email: 'user@bookstore.com', password: userPassword,
        phone: '9876543210', address: 'Kondapur, Hyderabad', role: 'user'
      });
    }

    // Clear old orders
    await Order.deleteMany({});
    console.log('🧹 Cleared existing orders catalogue.');

    // Fetch inserted books from DB to get correct references
    const dbBooks = await Book.find({});
    
    // Seed 20 mock orders over the last 10 days
    const statuses = ['Placed', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    const orderPromises = [];
    const now = new Date();

    for (let i = 0; i < 20; i++) {
      const numItems = Math.floor(Math.random() * 2) + 1; // 1 to 2 books
      const orderItems = [];
      let totalAmount = 0;
      
      for (let j = 0; j < numItems; j++) {
        const randomBook = dbBooks[Math.floor(Math.random() * dbBooks.length)];
        const qty = Math.floor(Math.random() * 2) + 1; // 1 to 2 quantity
        orderItems.push({
          book: randomBook._id,
          title: randomBook.title,
          image: randomBook.image,
          price: randomBook.price,
          quantity: qty,
          seller: randomBook.seller
        });
        totalAmount += randomBook.price * qty;
      }

      // Date spread over last 10 days
      const orderDate = new Date(now);
      orderDate.setDate(now.getDate() - Math.floor(Math.random() * 10));
      orderDate.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));

      orderPromises.push(Order.create({
        user: orderUser._id,
        items: orderItems,
        totalAmount,
        shippingAddress: {
          street: `Flat ${100 + i}, Book Street`,
          city: 'Hyderabad',
          state: 'Telangana',
          zipCode: '500081'
        },
        paymentMethod: i % 3 === 0 ? 'Card' : 'COD',
        paymentStatus: i % 5 === 0 ? 'Failed' : (i % 3 === 0 ? 'Paid' : 'Pending'),
        orderStatus: statuses[i % statuses.length],
        createdAt: orderDate
      }));
    }

    await Promise.all(orderPromises);
    console.log('✅ Seeded 20 mock order transactions for admin analytics!');

    console.log('🎉 Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding database:', err);
    process.exit(1);
  }
};

const runSeed = async () => {
  await seedDatabase();
};

runSeed();
