/**
 * Buttons and links that look like buttons. Every button has a type; every one has words.
 *   <Button testid="c.action.show" kind="primary" type="submit">Show what it pays</Button>
 *   <LinkButton testid="front.c.show" href="#/c/numbers?focus=you.age">Show me</LinkButton>
 */
export function Button({ testid, kind = 'plain', type = 'button', class: cls, children, ...rest }) {
  return <button type={type} class={`btn btn-${kind}${cls ? ' ' + cls : ''}`} data-testid={testid} {...rest}>{children}</button>;
}

export function LinkButton({ testid, kind = 'plain', href, class: cls, children, ...rest }) {
  return <a href={href} class={`btn btn-${kind}${cls ? ' ' + cls : ''}`} data-testid={testid} {...rest}>{children}</a>;
}
