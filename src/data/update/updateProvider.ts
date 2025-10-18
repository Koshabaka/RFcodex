export interface UpdateStatus {
  hasUpdate: boolean;
  checkedAt: string;
  message: string;
}

export interface UpdateProvider {
  check(): Promise<UpdateStatus>;
}

export class MockUpdateProvider implements UpdateProvider {
  async check(): Promise<UpdateStatus> {
    return {
      hasUpdate: false,
      checkedAt: new Date().toISOString(),
      message: 'Локальные данные актуальны',
    };
  }
}

export const updateProvider = new MockUpdateProvider();
