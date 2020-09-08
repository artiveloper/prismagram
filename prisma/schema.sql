-- 사용자
create table if not exists User
(
	id int auto_increment
		primary key,
	email varchar(191) not null,
	username varchar(191) not null,
	firstName varchar(191) default '' not null,
	lastName varchar(191) default '' not null,
	loginSecret varchar(191) default '' not null,
	bio varchar(191) not null
)
collate=utf8mb4_general_ci;

create unique index email on User (email);
create unique index username on User (username);

-- 게시글
create table if not exists Post
(
	id int auto_increment
		primary key,
	location varchar(191) not null,
	caption varchar(191) not null,
	userId int not null
)
collate=utf8mb4_general_ci;

create index userId on Post (userId);

-- 댓글
create table if not exists Comment
(
	id int auto_increment
		primary key,
	text varchar(191) not null,
	userId int not null,
	postId int not null
)
collate=utf8mb4_general_ci;

create index postId on Comment (postId);
create index userId	on Comment (userId);

-- 좋아요
create table if not exists `Like`
(
    id int auto_increment
        primary key,
    userId int not null,
    postId int not null
)
    collate=utf8mb4_general_ci;

create index postId on `Like` (postId);
create index userId	on `Like` (userId);

-- 팔로우/팔로워
create table if not exists FollowRelation
(
    id int auto_increment
        primary key,
    followingId int not null,
    followerId int not null
)
    collate=utf8mb4_unicode_ci;

create index followingId on FollowRelation (followingId);
create index followerId on FollowRelation (followerId);
