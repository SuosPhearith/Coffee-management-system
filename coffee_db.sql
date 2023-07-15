-- phpMyAdmin SQL Dump
-- version 5.1.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 15, 2023 at 05:09 PM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 7.4.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `coffee_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `orderitems`
--

CREATE TABLE `orderitems` (
  `OrderItemID` int(11) NOT NULL,
  `OrderID` int(11) DEFAULT NULL,
  `ProductID` int(11) DEFAULT NULL,
  `Quantity` int(11) DEFAULT NULL,
  `TotalPrice` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `orderitems`
--

INSERT INTO `orderitems` (`OrderItemID`, `OrderID`, `ProductID`, `Quantity`, `TotalPrice`) VALUES
(190, 275, 1, 1, '1.50'),
(191, 275, 2, 1, '3.00'),
(192, 275, 4, 1, '2.90'),
(193, 276, 114, 1, '2.00'),
(194, 276, 118, 3, '3.00'),
(195, 276, 115, 3, '4.50'),
(196, 277, 114, 3, '6.00'),
(197, 277, 2, 1, '3.00');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `OrderID` int(11) NOT NULL,
  `UserID` int(11) DEFAULT NULL,
  `OrderDate` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`OrderID`, `UserID`, `OrderDate`) VALUES
(275, 22, '2023-07-15 00:00:00'),
(276, 22, '2023-07-15 00:00:00'),
(277, 10, '2023-07-15 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `PaymentID` int(11) NOT NULL,
  `OrderID` int(11) DEFAULT NULL,
  `PaymentAmount` decimal(10,2) DEFAULT NULL,
  `PaymentMethod` varchar(50) DEFAULT NULL,
  `TransactionDetails` varchar(255) DEFAULT NULL,
  `TotalAmount` decimal(10,2) DEFAULT NULL,
  `Discount` decimal(10,2) DEFAULT NULL,
  `Total` decimal(10,2) DEFAULT NULL,
  `Debt` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`PaymentID`, `OrderID`, `PaymentAmount`, `PaymentMethod`, `TransactionDetails`, `TotalAmount`, `Discount`, `Total`, `Debt`) VALUES
(73, 275, '7.40', 'Cash', 'Pay all', '7.40', '0.00', '7.40', '0.00'),
(74, 276, '7.60', 'Cash', 'Pay all', '9.50', '20.00', '7.60', '0.00'),
(75, 277, '9.00', 'Cash', 'Pay all', '9.00', '0.00', '9.00', '0.00');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `ProductID` int(11) NOT NULL,
  `Name` varchar(100) DEFAULT NULL,
  `Price` decimal(10,2) DEFAULT NULL,
  `Image` varchar(255) DEFAULT NULL,
  `Description` varchar(255) DEFAULT NULL,
  `Quantity` int(2) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`ProductID`, `Name`, `Price`, `Image`, `Description`, `Quantity`) VALUES
(1, 'Prime', '1.50', '1688695317622-_129773076_img_3535.jpg', 'The coke that promoted by Speed.', 1),
(2, 'Cocacola', '3.00', '1688695482552-b7hdgz6h6i8ijhxqn98aza_product_list.jpg', 'The best coke.', 1),
(4, 'Sting', '2.90', '1688695347272-sting.jpg', 'The coke that promoted by G-devith.', 1),
(113, 'Milk Tea', '2.50', '1688695527695-milk_tea.png', 'About milk tea', 1),
(114, 'Ice Latte', '2.00', '1688695567604-Iced_Latte.jpg', 'About Ice Latte', 1),
(115, 'BlackCoffee', '1.50', '1688695607238-black_coffee.jpg', 'About black coffee', 1),
(116, 'Matcha', '3.00', '1688695662628-matcha-frappe_Atsushi-Hirao_Shutterstock-500x500.jpg', 'About matcha', 1),
(118, 'Milk', '1.00', '1688992153158-Iced_Latte.jpg', 'About milk', 1),
(119, 'Ice Cream', '1.00', '1689003324413-matcha-frappe_Atsushi-Hirao_Shutterstock-500x500.jpg', 'about ice cream', 1),
(121, 'Green tea', '2.00', '1689181087328-Ex2.1.jpg', 'about green tea', 1),
(124, 'Milkita', '1.00', '1689358902166-YellowCup-Nov2019-010.jfif', 'about candy', 1),
(126, 'Olatte', '1.00', '1689364347885-Discount.png', 'about olatte', 1);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `UserID` int(11) NOT NULL,
  `Name` varchar(50) DEFAULT NULL,
  `Username` varchar(255) DEFAULT NULL,
  `Password` varchar(255) DEFAULT NULL,
  `Image` varchar(255) DEFAULT NULL,
  `Role` enum('admin','employee') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`UserID`, `Name`, `Username`, `Password`, `Image`, `Role`) VALUES
(10, 'Phearith', 'phearith@gmail.com', '$2b$10$xPQi4yy42Jt1Qcb0opEVBeYIaGwuZtQReW6x3Wyy4p/1PuCBE0b42', '1688455786160-Crop01.jpg', 'admin'),
(11, 'Thida', 'thida@gmail.com', '$2b$10$yrIBO6RkgDwxruvZ5TmP7.xYwt8x2fu3naGagYJKRtZow17PTjl66', '1688456924319-Adjustment 01.jpg', 'employee'),
(13, 'Sethy', 'sethy@gmail.com', '$2b$10$EJl.oIZfX1d4nPKUFxldEORKzgnMEg41TmZ7QW07JsgB91NKfswRa', '1689181124146-Crop01.jpg', 'employee'),
(22, 'Lin', 'lin@gmail.com', '$2b$10$ga7GXJ1x6Y9CRfRZdxQeCeFEEK/eroVudmsOm2D3NcWf8gJd3wxqG', '1688458475284-Blur01.jpg', 'employee'),
(23, 'Veasna', 'veasna@gmail.com', '$2b$10$u/cC/grudh0tajkJsx8zK.6ixd2qyva9JNXL2jM4mQwXPAJb9s91G', '1688575259181-Online.png', 'admin'),
(25, 'Dara', 'sava@gmail.com', '$2b$15$7krDFHe6Hvd1aotNEhE2.ejc5XVGpsoar7JW8vfuZpZgaivd9tSkC', '1688459735814-photo_2021-12-18_15-29-58.jpg', 'admin'),
(26, 'Sister', 'sister@gmail.com', '$2b$10$aNZ7voBNtLe09rPeFcPadOWNOMSTl4mB/eAqQ4xGydMOFi706fQ9i', '1688563595468-Blur01.jpg', 'admin'),
(28, 'Khemara', 'khemara@gmail.com', '$2b$15$Ct0EDDOkcz7p8ewqnLhC4OXkMTGEz.RbJkcqTww1.6/TVLIsSBfzm', '1688994556897-b7hdgz6h6i8ijhxqn98aza_product_list.jpg', 'employee');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `orderitems`
--
ALTER TABLE `orderitems`
  ADD PRIMARY KEY (`OrderItemID`),
  ADD KEY `OrderID` (`OrderID`),
  ADD KEY `ProductID` (`ProductID`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`OrderID`),
  ADD KEY `UserID` (`UserID`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`PaymentID`),
  ADD KEY `OrderID` (`OrderID`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`ProductID`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`UserID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `orderitems`
--
ALTER TABLE `orderitems`
  MODIFY `OrderItemID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=198;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `OrderID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=278;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `PaymentID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=76;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `ProductID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=127;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `UserID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `orderitems`
--
ALTER TABLE `orderitems`
  ADD CONSTRAINT `orderitems_ibfk_1` FOREIGN KEY (`OrderID`) REFERENCES `orders` (`OrderID`) ON DELETE SET NULL,
  ADD CONSTRAINT `orderitems_ibfk_2` FOREIGN KEY (`ProductID`) REFERENCES `products` (`ProductID`);

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`);

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`OrderID`) REFERENCES `orders` (`OrderID`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
