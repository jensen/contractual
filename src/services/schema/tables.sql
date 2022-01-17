create table accounts (
  id uuid default extensions.uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,

  address text not null,

  owner_id uuid default auth.uid() not null,
  constraint owner_id foreign key(owner_id) references profiles(id) on delete cascade
);

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
  returns trigger as
$$
begin
    new.content = replace(new.content, chr(13), ''); -- strip CR since this needs to be hashed
    new.hash = replace(extensions.digest(convert_to(new.content, 'utf8'), 'sha256')::text, '\'::text, '0'::text);
    return new;
end
$$ language plpgsql;

create trigger on_revision_created_hash
  before insert on revisions
  for each row execute procedure hash_revision_content();

-- rpc

create or replace function public.add_account(address text)
  returns accounts language plpgsql as $$
declare
  account accounts;
begin
  insert into public.accounts (
    address
  ) select * from (
    values(
      $1
    )
  ) as t (text)
  where (
    exists(select public.accounts.address from public.accounts where public.accounts.address = $1)
  ) = false returning * into account;

  return account;
end $$;

create or replace function public.get_signee_accounts(addresses text[],  OUT name text, OUT avatar text,  OUT address text)
  returns setof record language plpgsql as $$
begin
  return query
    select
      profiles.name,
      profiles.avatar,
      accounts.address
    from profiles
    join accounts on accounts.owner_id = profiles.id
    where accounts.address = any($1);
end $$;