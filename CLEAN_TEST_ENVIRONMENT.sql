
-- DELETE TEST LISTINGS
delete from listings;

-- DELETE REPORTS
delete from reports;

-- DELETE REVIEWS
delete from user_reviews;

-- DELETE MODERATION
delete from moderation_actions;

-- DELETE CONTACT ADMIN
delete from admin_messages;

-- KEEP ONLY PRIMARY ADMIN USERS
delete from profiles
where role is null
or role not in (
  'owner',
  'admin',
  'moderator'
);

