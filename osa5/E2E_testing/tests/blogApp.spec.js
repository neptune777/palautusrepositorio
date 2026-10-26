const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog, extractValueInString } = require('./helper')
const { deepEqual } = require('node:assert')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await page.getByRole('link', { name: 'login' }).click()
    const formElement = page.locator('form').filter({ has: page.getByLabel('username') })
    await expect(formElement.getByLabel('username')).toBeVisible()
    await expect(formElement.getByLabel('password')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
      await expect(page.getByRole('link', { name: 'log out' })).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'wrong')
      await expect(page.getByRole('link', { name: 'log out' })).not.toBeVisible()
      const errorElement = page.getByText('wrong username or password')
      await expect(errorElement).toBeVisible()
      await expect(errorElement).toHaveCSS('color', 'rgb(95, 33, 32)')
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
      await createBlog(page, 'title of test blog', 'author of test blog', 'url of test blog')
    })

    test('a new blog can be created', async ({ page }) => {
      await expect(page.getByRole('link', { name: 'title of test blog by author of test blog' })).toBeVisible()
    })

    test('blog can be liked', async ({ page }) => {
      const notification = page.getByText('a new blog title of test blog by author of test blog added', {
        exact: true
      })
      await expect(notification).toBeVisible()
      await expect(notification).not.toBeVisible({ timeout: 6000 })
      await page.getByRole('link', { name: 'title of test blog by author of test blog' }).click()
      const element = page.getByTestId('test-id-for-playwright')

      for (var prop in element) {
        if (Object.prototype.hasOwnProperty.call(element, prop)) {
          console.log('prop:', prop)
        }
      }
      const text = await element.innerText()
      console.log('text:', text)
      await page.getByRole('button', { name: 'like', exact: true }).click()
      await element.getByText('1 likes').waitFor()
      const textNow = await element.innerText()
      console.log('textNow:', textNow)
      const valueBeforeLiking = Number(extractValueInString(text)) + 1
      const valueNow = Number(extractValueInString(textNow))
      deepEqual(valueBeforeLiking, valueNow)
    })

    test('blog can be removed', async ({ page }) => {
      await page.getByRole('link', { name: 'title of test blog by author of test blog' }).click()
      const ourInnerElement = page.getByText('Added by Matti Luukkainen')
      await expect(ourInnerElement).toHaveCount(1)
      page.on('dialog', dialog => dialog.accept());
      await page.getByRole('button', { name: 'remove' }).click();
      const notification = page.getByText('blog was deleted', {
        exact: true
      })
      await expect(notification).toBeVisible()

      await expect(page).toHaveURL('http://localhost:5173/')

      await expect(page.getByRole('link', {
        name: 'title of test blog by author of test blog',
        exact: true
      })).toHaveCount(0)
    })

    test('remove button not visible for user who has not added the blog', async ({ page, request }) => {
      await page.getByRole('link', { name: 'log out' }).click();
      await request.post('http://localhost:3003/api/users', {
        data: {
          name: 'Matti Kinnunen',
          username: 'mkinnu',
          password: 'secret'
        }
      })
      await loginWith(page, 'mkinnu', 'secret')
      await page.getByRole('link', { name: 'title of test blog by author of test blog' }).click()
      await expect(page.getByRole('button', { name: 'like' })).toHaveCount(1)
      await expect(page.getByRole('button', {
        name: 'remove',
        exact: true
      })).toHaveCount(0)
    })
    /*
    test('blogs are sorted in descending order by likes', async ({ page }) => {
      await createBlog(page, 'title of test blog2', 'author of test blog2', 'url of test blog2')
      await createBlog(page, 'title of test blog3', 'author of test blog3', 'url of test blog3')

      const blogTable = page.getByRole('table').filter({
        hasText: 'title of test blog author of test blog'
      })
      await blogTable.getByRole('button', { name: 'View', exact: true }).click()
      await blogTable.getByRole('button', { name: 'like', exact: true }).click()
      await blogTable.getByText('likes 1like').waitFor()
      await blogTable.getByRole('button', { name: 'hide' }).click();

      const blogTable2 = page.getByRole('table').filter({
        hasText: 'title of test blog2 author of test blog2'
      })
      await blogTable2.getByRole('button', { name: 'View', exact: true }).click()
      const likeButtonOfSecondBlog = blogTable2.getByRole('button', { name: 'like', exact: true })
      await likeButtonOfSecondBlog.click()
      await blogTable2.getByText('likes 1like').waitFor()
      await likeButtonOfSecondBlog.click()
      await blogTable2.getByText('likes 2like').waitFor()
      await likeButtonOfSecondBlog.click()
      await blogTable2.getByText('likes 3like').waitFor()
      await blogTable2.getByRole('button', { name: 'hide' }).click();

      const blogTable3 = page.getByRole('table').filter({
        hasText: 'title of test blog3 author of test blog3'
      })
      await blogTable3.getByRole('button', { name: 'View', exact: true }).click()
      const likeButtonOfThirdBlog = blogTable3.getByRole('button', { name: 'like', exact: true })
      await likeButtonOfThirdBlog.click()
      await blogTable3.getByText('likes 1like').waitFor()
      await likeButtonOfThirdBlog.click()
      await blogTable3.getByText('likes 2like').waitFor()

      await blogTable.getByRole('button', { name: 'View', exact: true }).click()
      await blogTable2.getByRole('button', { name: 'View', exact: true }).click()

      const elements = await page.getByRole('cell', { name: 'likes', exact: false }).all()

      const likesOfFirst = Number(extractValueInString(await elements[0].innerText()))
      const likesOfSecond = Number(extractValueInString(await elements[1].innerText()))
      const likesOfThird = Number(extractValueInString(await elements[2].innerText()))

      expect(likesOfFirst > likesOfSecond && likesOfSecond > likesOfThird).toBeTruthy()
    })
      */
  })
})