import styled from 'styled-components';

export const PostCardStyled = styled.div`
  width: 300px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 15px;
  border: solid 1px #777;
  cursor: pointer;
  transition: all .2s;

  :hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0,0,0,.2);
  }

  :active {
    transform: translateY(-3px);
    box-shadow: 0 10px 10px rgba(0,0,0,.2);
  }
  
  p {
    font-size: 0.8rem;
  }
  .title {
    font-weight: 700;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }
  .body {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
  }
`;
