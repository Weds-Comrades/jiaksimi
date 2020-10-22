-- phpMyAdmin SQL Dump
-- version 4.9.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Oct 22, 2020 at 02:48 AM
-- Server version: 5.7.26
-- PHP Version: 7.4.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+08:00";

--
-- Database: `jiaksimi`
--

CREATE DATABASE IF NOT EXISTS `jiaksimi` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `jiaksimi`;

-- --------------------------------------------------------

--
-- Table structure for table `Tag`
--

DROP TABLE IF EXISTS `Tag`;
CREATE TABLE `Tag` (
  `id` int NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `tag_uid` varchar(32) NOT NULL,
  `tag_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
CREATE TABLE `User` (
  `id` int NOT NULL PRIMARY KEY AUTO_INCREMENT ,
  `email` varchar(255) NOT NULL,
  `password` binary(32) NOT NULL,
  `name` varchar(255) NOT NULL,
  `photo` longblob
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `User_Distance`
--

DROP TABLE IF EXISTS `User_Distance`;
CREATE TABLE `User_Distance` (
  `user_id` int NOT NULL PRIMARY KEY,
  `distance` int NOT NULL,
  CONSTRAINT FK_UserDistance FOREIGN KEY (`user_id`) REFERENCES `User`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `User_Favourite`
--

DROP TABLE IF EXISTS `User_Favourite`;
CREATE TABLE `User_Favourite` (
  `user_id` int NOT NULL ,
  `places_id` varchar(255) NOT NULL,
  CONSTRAINT PK_UserFavourite PRIMARY KEY (`user_id`, `places_id`),
  CONSTRAINT FK_UserFavourite FOREIGN KEY (`user_id`) REFERENCES `User`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `User_Tag`
--

DROP TABLE IF EXISTS `User_Tag`;
CREATE TABLE `User_Tag` (
  `user_id` int NOT NULL,
  `tag_id` int NOT NULL,
CONSTRAINT PK_UserTag PRIMARY KEY (`user_id`, `tag_id`),
CONSTRAINT FK_UserTag_1 FOREIGN KEY (`user_id`) REFERENCES `User`(`id`),
CONSTRAINT FK_UserTag_2 FOREIGN KEY (`tag_id`) REFERENCES `Tag`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

