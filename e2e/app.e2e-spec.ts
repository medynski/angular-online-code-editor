import { AppPage } from './app.po';

describe('App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display error message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Page not found.');
  });
});
