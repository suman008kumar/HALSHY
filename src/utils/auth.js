const ACCOUNTS_KEY = 'streamorbit:login-accounts';
const ADMIN_PASSWORD = 'SUMRAM12345';

function readAccounts() {
  try {
    const value = JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || '[]');
    return Array.isArray(value) ? value.filter(item => item && typeof item.name === 'string' && typeof item.password === 'string') : [];
  } catch { return []; }
}
function writeAccounts(accounts) { localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts)); }

export const auth = {
  async verifyAdmin(password) { return password === ADMIN_PASSWORD; },
  getAccounts() { return readAccounts(); },
  async addAccount(name, password) {
    const cleanName = name.trim();
    if (!cleanName || !password) throw new Error('Enter both a name and password.');
    const accounts = readAccounts();
    if (accounts.some(account => account.name.toLowerCase() === cleanName.toLowerCase())) throw new Error('That name already exists. Use a different name.');
    const account = { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, name: cleanName, password };
    writeAccounts([...accounts, account]);
    return account;
  },
  async updateAccount(id, name, password) {
    const cleanName = name.trim();
    if (!cleanName || !password) throw new Error('Enter both a name and password.');
    const accounts = readAccounts();
    if (accounts.some(account => account.id !== id && account.name.toLowerCase() === cleanName.toLowerCase())) throw new Error('That name already exists.');
    const updated = accounts.map(account => account.id === id ? { ...account, name: cleanName, password } : account);
    writeAccounts(updated);
    return updated.find(account => account.id === id);
  },
  deleteAccount(id) { writeAccounts(readAccounts().filter(account => account.id !== id)); },
  async verifyLogin(name, password) {
    const cleanName = name.trim().toLowerCase();
    return readAccounts().find(account => account.name.toLowerCase() === cleanName && account.password === password) || null;
  },
  hasLoginPassword() { return readAccounts().length > 0; },
  deleteLoginPassword() { writeAccounts([]); }
};
