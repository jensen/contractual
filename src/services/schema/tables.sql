create table contracts (
  id uuid default extensions.uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,

  name text not null,

  creator_id uuid default auth.uid() not null,
  constraint creator_id foreign key(creator_id) references profiles(id) on delete cascade
);

create table revisions (
  id uuid default extensions.uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,

  content text not null,
  hash text not null,

  contract_id uuid not null,
  constraint contract_id foreign key(contract_id) references contracts(id) on delete cascade,

  editor_id uuid default auth.uid() not null,
  constraint editor_id foreign key(editor_id) references profiles(id) on delete cascade
);

create or replace function hash_revision_content()
returns trigger as $$
begin 
  new.hash = extensions.digest(convert_to(new.content, 'utf8'), 'sha256');
  return new; 
end
$$ language plpgsql;

create trigger on_revision_created_hash
before insert on revisions
for each row execute procedure hash_revision_content();