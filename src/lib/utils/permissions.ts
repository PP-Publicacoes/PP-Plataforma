export const Permissions = {
  MANAGE_COMMUNITY: 1 << 0, // editar config, deletar comunidade
  MANAGE_ROLES: 1 << 1, // criar/editar papéis
  INVITE: 1 << 2, // convidar usuários
  REMOVE_MEMBER: 1 << 3, // remover membros
  POST: 1 << 4, // criar posts
  COMMENT: 1 << 5, // comentar
  VIEW_PRIVATE: 1 << 6, // ver conteúdo privado
  DELETE_COMMUNITY: 1 << 7, // deletar comunidade
} as const;

export type Permissions = (typeof Permissions)[keyof typeof Permissions];

export const hasPerm = (mask: number, p: Permissions) => (mask & p) === p;
export const addPerms = (...p: number[]) => p.reduce((acc, cur) => acc | cur, 0);

export const ROLE_PRESETS = {
  Creator: addPerms(
    Permissions.MANAGE_COMMUNITY,
    Permissions.MANAGE_ROLES,
    Permissions.INVITE,
    Permissions.REMOVE_MEMBER,
    Permissions.POST,
    Permissions.COMMENT,
    Permissions.VIEW_PRIVATE,
    Permissions.DELETE_COMMUNITY
  ),
  Admin: addPerms(
    Permissions.MANAGE_COMMUNITY,
    Permissions.MANAGE_ROLES,
    Permissions.INVITE,
    Permissions.REMOVE_MEMBER,
    Permissions.POST,
    Permissions.COMMENT,
    Permissions.VIEW_PRIVATE
  ),
  Moderator: addPerms(
    Permissions.INVITE,
    Permissions.REMOVE_MEMBER,
    Permissions.POST,
    Permissions.COMMENT,
    Permissions.VIEW_PRIVATE
  ),
  Member: addPerms(
    Permissions.POST,
    Permissions.COMMENT
  ),
} as const;

export type RoleName = keyof typeof ROLE_PRESETS;
