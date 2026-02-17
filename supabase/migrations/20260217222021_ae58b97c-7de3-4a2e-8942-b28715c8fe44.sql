
-- Create the user account
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  aud,
  role,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'pfemprestimos@gmail.com',
  crypt('deusefiel', gen_salt('bf')),
  now(),
  'authenticated',
  'authenticated',
  '{"provider":"email","providers":["email"]}',
  '{}',
  now(),
  now(),
  '',
  ''
);

-- Also add identity
INSERT INTO auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  provider_id,
  last_sign_in_at,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM auth.users WHERE email = 'pfemprestimos@gmail.com'),
  jsonb_build_object('sub', (SELECT id::text FROM auth.users WHERE email = 'pfemprestimos@gmail.com'), 'email', 'pfemprestimos@gmail.com'),
  'email',
  (SELECT id::text FROM auth.users WHERE email = 'pfemprestimos@gmail.com'),
  now(),
  now(),
  now()
);
